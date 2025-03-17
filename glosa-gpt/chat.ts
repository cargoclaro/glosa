import OpenAI from "openai";
import { config } from "dotenv";

config();

const openai = new OpenAI();

// Define interfaces for the response structure
interface FileSearchResult {
    file_id: string;
    filename: string;
    text: string;
    attributes: Record<string, any>;
    score: number;
}

interface FileSearchCall {
    type: 'file_search_call';
    results: FileSearchResult[];
    [key: string]: any;
}

interface FileCitation {
    type: 'file_citation';
    file_id: string;
    index: number;
}

async function main() {
    const response = await openai.responses.create({
        model: "o3-mini-2025-01-31",
        input: "Aparte de pedimentos sencillos y consolidados, que otros tipos de pedimentos existen? No me refiero a las claves de pedimento distintas del anexo 22, sino pedimentos cualitativamente distintos.",
        tools: [{
            type: "file_search",
            vector_store_ids: ["vs_67d7695b431c8191b1cf2b09e77f7584"],
        }],
        include: ["file_search_call.results"],
    });
    
    // Extract the answer text
    const answerText = response.output_text;
    
    // Display the answer
    console.log('\n=== ANSWER ===\n');
    console.log(answerText);
    
    // Extract and display citations
    if (response.output && response.output.length > 0) {
        const searchCall = response.output.find(item => item.type === 'file_search_call') as FileSearchCall | undefined;
        const messageOutput = response.output.find(item => item.type === 'message');
        
        // Make sure we have both the message output and search results
        if (messageOutput?.content && searchCall?.results) {
            const contentWithCitations = messageOutput.content.find(item => item.type === 'output_text');
            
            if (contentWithCitations && contentWithCitations.annotations) {
                console.log('\n=== CITATIONS ===\n');
                
                contentWithCitations.annotations.forEach((annotation: any, index) => {
                    if (annotation.type === 'file_citation') {
                        const citation = annotation as FileCitation;
                        console.log(`Citation ${index + 1}:`);
                        console.log(`File ID: ${citation.file_id || 'Unknown'}`);
                        
                        // Find the corresponding result in search results
                        const citedResult = searchCall.results.find(result => 
                            result.file_id === citation.file_id
                        );
                        
                        if (citedResult) {
                            console.log(`Filename: ${citedResult.filename}`);
                            
                            // Display a snippet of the text (first 150 chars)
                            if (citedResult.text) {
                                console.log(`Snippet: "${citedResult.text}"`);
                            }
                        }
                        
                        console.log(`Index position: ${citation.index}`);
                        console.log('---');
                    }
                });
            }
        }
    }
}

main();
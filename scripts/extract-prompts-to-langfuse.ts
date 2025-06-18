#!/usr/bin/env tsx

import { env } from '../lib/env/server.js';
import { Langfuse } from 'langfuse';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Initialize Langfuse client
const langfuse = new Langfuse({
  baseUrl: env.LANGFUSE_BASEURL,
  publicKey: env.LANGFUSE_PUBLIC_KEY,
  secretKey: env.LANGFUSE_SECRET_KEY,
});

interface ExtractedPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  validationFile: string;
  functionName: string;
  section: string; // 'pedimento' or 'cove'
  operationType: string; // 'impo' or 'expo'
}

// Function to extract prompts from TypeScript files
function extractPromptsFromFile(filePath: string): ExtractedPrompt[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const prompts: ExtractedPrompt[] = [];
  
  // Determine section and operation type from file path
  const section = filePath.includes('/pedimento/') ? 'pedimento' : 'cove';
  const operationType = filePath.includes('_impo/') ? 'impo' : 'expo';
  const fileName = path.basename(filePath, '.ts');
  
  // Regex to find validation objects with name, description, and prompt
  const validationRegex = /const\s+validation\s*=\s*\{[\s\S]*?name:\s*['"`]([^'"`]+)['"`],[\s\S]*?description:\s*['"`]([\s\S]*?)['"`],[\s\S]*?prompt:\s*['"`]([\s\S]*?)['"`],[\s\S]*?\}\s*as\s+const;/g;
  
  let match;
  while ((match = validationRegex.exec(content)) !== null) {
    const [, name, description, prompt] = match;
    
    // Find the function name by looking backwards from the validation
    const beforeValidation = content.substring(0, match.index);
    const functionMatch = beforeValidation.match(/async\s+function\s+(\w+)\s*\(/g);
    const functionName = functionMatch ? functionMatch[functionMatch.length - 1].match(/function\s+(\w+)/)?.[1] || 'unknown' : 'unknown';
    
    // Clean up multiline strings
    const cleanDescription = description.replace(/\s+/g, ' ').trim();
    const cleanPrompt = prompt
      .replace(/\\n/g, '\n')
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
    
    prompts.push({
      id: `${section}_${operationType}_${fileName}_${functionName}`,
      name: name.trim(),
      description: cleanDescription,
      prompt: cleanPrompt,
      validationFile: fileName,
      functionName,
      section,
      operationType,
    });
  }
  
  return prompts;
}

// Function to get all validation files
function getAllValidationFiles(): string[] {
  const basePath = path.join(process.cwd(), 'app/shared/services/customGloss/glosa');
  const files: string[] = [];
  
  // Pedimento validation files
  const pedimentoImpoPath = path.join(basePath, 'pedimento/validation_steps_impo');
  if (fs.existsSync(pedimentoImpoPath)) {
    const pedimentoFiles = fs.readdirSync(pedimentoImpoPath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts' && file !== 'test.html')
      .map(file => path.join(pedimentoImpoPath, file));
    files.push(...pedimentoFiles);
  }
  
  const pedimentoExpoPath = path.join(basePath, 'pedimento/validation_steps_expo');
  if (fs.existsSync(pedimentoExpoPath)) {
    const pedimentoFiles = fs.readdirSync(pedimentoExpoPath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => path.join(pedimentoExpoPath, file));
    files.push(...pedimentoFiles);
  }
  
  // COVE validation files
  const coveImpoPath = path.join(basePath, 'cove/validation_steps_impo');
  if (fs.existsSync(coveImpoPath)) {
    const coveFiles = fs.readdirSync(coveImpoPath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => path.join(coveImpoPath, file));
    files.push(...coveFiles);
  }
  
  const coveExpoPath = path.join(basePath, 'cove/validation_steps_expo');
  if (fs.existsSync(coveExpoPath)) {
    const coveFiles = fs.readdirSync(coveExpoPath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => path.join(coveExpoPath, file));
    files.push(...coveFiles);
  }
  
  return files;
}

// Function to clear existing prompts in Langfuse
async function clearExistingPrompts() {
  console.log('🧹 Clearing existing prompts in Langfuse...');
  
  try {
    // Note: Langfuse doesn't have a direct API to delete all prompts
    // We'll just create new ones with unique names or versions
    console.log('ℹ️  Langfuse doesn\'t support bulk deletion. New prompts will be created.');
  } catch (error) {
    console.error('❌ Error clearing prompts:', error);
  }
}

// Function to upload prompts to Langfuse
async function uploadPromptsToLangfuse(prompts: ExtractedPrompt[]) {
  console.log(`📤 Uploading ${prompts.length} prompts to Langfuse...`);
  
  for (const extractedPrompt of prompts) {
    try {
      const langfusePrompt = await langfuse.createPrompt({
        name: `glosa/${extractedPrompt.section}/${extractedPrompt.operationType}/${extractedPrompt.id}`,
        type: 'text',
        prompt: extractedPrompt.prompt,
        labels: ['production'],
        config: {
          model: 'gpt-4o-mini',
          temperature: 0,
          validationName: extractedPrompt.name,
          description: extractedPrompt.description,
          validationFile: extractedPrompt.validationFile,
          functionName: extractedPrompt.functionName,
          section: extractedPrompt.section,
          operationType: extractedPrompt.operationType,
        },
      });
      
      console.log(`✅ Uploaded: ${extractedPrompt.name} (${extractedPrompt.id})`);
    } catch (error) {
      console.error(`❌ Error uploading prompt ${extractedPrompt.id}:`, error);
    }
  }
}

// Function to create a dataset with the prompts
async function createDatasetWithPrompts(prompts: ExtractedPrompt[]) {
  console.log('📊 Creating dataset in Langfuse...');
  
  try {
    // Create dataset
    const dataset = await langfuse.createDataset({
      name: 'glosa-validation-prompts',
      description: 'All validation prompts extracted from glosa validation steps for pedimento and COVE documents (import and export operations)',
      metadata: {
        totalPrompts: prompts.length,
        sections: [...new Set(prompts.map(p => p.section))],
        operationTypes: [...new Set(prompts.map(p => p.operationType))],
        extractedAt: new Date().toISOString(),
      },
    });
    
    console.log(`✅ Dataset created: ${dataset.name}`);
    
    // Add items to dataset
    for (const prompt of prompts) {
      try {
        await langfuse.createDatasetItem({
          datasetName: 'glosa-validation-prompts',
          input: {
            validationName: prompt.name,
            prompt: prompt.prompt,
            section: prompt.section,
            operationType: prompt.operationType,
            validationFile: prompt.validationFile,
            functionName: prompt.functionName,
          },
          expectedOutput: {
            // This would be filled later with actual test cases
            placeholder: 'Expected output to be defined based on test cases',
          },
          metadata: {
            id: prompt.id,
            description: prompt.description,
          },
        });
        
        console.log(`📝 Added dataset item: ${prompt.name}`);
      } catch (error) {
        console.error(`❌ Error adding dataset item ${prompt.id}:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating dataset:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting prompt extraction and upload to Langfuse...\n');
  
  try {
    // Clear existing prompts
    await clearExistingPrompts();
    
    // Get all validation files
    const validationFiles = getAllValidationFiles();
    console.log(`📁 Found ${validationFiles.length} validation files\n`);
    
    // Extract prompts from all files
    let allPrompts: ExtractedPrompt[] = [];
    for (const file of validationFiles) {
      console.log(`🔍 Extracting prompts from: ${path.basename(file)}`);
      const prompts = extractPromptsFromFile(file);
      allPrompts.push(...prompts);
      console.log(`   Found ${prompts.length} prompts\n`);
    }
    
    console.log(`📊 Total prompts extracted: ${allPrompts.length}\n`);
    
    // Group by section and operation type for summary
    const summary = allPrompts.reduce((acc, prompt) => {
      const key = `${prompt.section}_${prompt.operationType}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📈 Summary by section:');
    Object.entries(summary).forEach(([key, count]) => {
      console.log(`   ${key}: ${count} prompts`);
    });
    console.log();
    
    // Upload prompts to Langfuse
    await uploadPromptsToLangfuse(allPrompts);
    
    // Create dataset
    await createDatasetWithPrompts(allPrompts);
    
    console.log('\n✨ Process completed successfully!');
    console.log(`📊 Total prompts uploaded: ${allPrompts.length}`);
    console.log('🔗 Check your Langfuse dashboard for the new prompts and dataset.');
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    // Ensure all requests are sent
    await langfuse.shutdownAsync();
  }
}

// Run the script
main(); 
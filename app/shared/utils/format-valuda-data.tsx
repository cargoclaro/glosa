const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "number" || typeof value === "string") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc pl-5">
        {value.map((item, index) => (
          <li key={index}>{formatValue(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="border p-2 rounded bg-gray-100">
        {Object.entries(value).map(([key, val], index) => (
          <div key={index} className="mb-1">
            <strong>{key}:</strong> {formatValue(val)}
          </div>
        ))}
      </div>
    );
  }

  return value.toString();
};

export default formatValue;

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return formatValue(parsed);
    } catch {
      return value;
    }
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-none overflow-y-auto">
        {value.map((item, index) => (
          <li key={index}>{formatValue(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="p-2 overflow-y-auto">
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

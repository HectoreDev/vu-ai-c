

export function parseResponse(input: string): (string | object)[] {

  const regex = /```json([\s\S]*?)```|({[\s\S]*})/m;
  const match = input.match(regex);

  if (!match) {
    return [input.trim()];
  }

  const jsonString = match[1] || match[2];

  let parsed: object;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {

    return [input.trim()];
  }

  const before = input.slice(0, match.index).trim();
  const after = input.slice((match.index ?? 0) + match[0].length).trim();

  const result: (string | object)[] = [];
  if (before) result.push(before);
  result.push(parsed);
  if (after) result.push(after);

  return result;
}
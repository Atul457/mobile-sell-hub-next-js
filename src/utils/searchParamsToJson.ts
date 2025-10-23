import type { URLSearchParams } from "url";

type ISearchParamsToJsonArgs = {
  params: URLSearchParams;
};

const searchParamsToJson = (args: ISearchParamsToJsonArgs) => {
  let name = "";
  let value = "";
  const json: Record<string, any> = {};

  for (const pair of (args.params as any).entries()) {
    name = pair[0].replace("[]", "");
    value = pair[1];

    if (pair[0]?.includes("[]")) {
      json[name] = [...(json[name] ?? []), value];
    } else {
      json[name] = value;
    }
  }

  
return json;
};

export { searchParamsToJson };

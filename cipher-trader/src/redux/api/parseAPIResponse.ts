import _ from 'lodash';

const ALL_FIELDS = '_ALL_FIELDS_' as const;

type Explicit<T extends {[key: string]: {keys: any | typeof ALL_FIELDS}}> = {
  [key in keyof T]: {
    readonly keys: T[keyof T]['keys'] | typeof ALL_FIELDS;
  };
};

const apiParsingOptions = {
  marketOrder: {
    keys: ['orderID'] as const,
  },
};

type ParsingOptions = typeof apiParsingOptions;

export function parseData<K extends keyof ParsingOptions>(parsingOptions: Explicit<ParsingOptions>) {
  return (method: K) => {
    return <D, Keys = ParsingOptions[K]['keys']>(
      data: D,
    ): Keys extends readonly any[] ? Pick<D, Keys[number]>[] : D => {
      const parsedData: D[] | D = JSON.parse((data as unknown) as string);
      const asArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      const {keys} = parsingOptions[method];
      return keys === ALL_FIELDS ? asArray : (asArray.map((item: any) => _.pick(item, keys)) as any);
    };
  };
}

export default parseData(apiParsingOptions);

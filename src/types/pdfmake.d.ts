declare module 'pdfmake/interfaces' {
  export interface TDocumentDefinitions {
    pageSize?: string | { width: number; height: number };
    pageMargins?: number[] | number;
    content: any[];
    styles?: Record<string, any>;
    [key: string]: any;
  }
}

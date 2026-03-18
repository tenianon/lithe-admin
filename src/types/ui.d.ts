declare module 'https://cdn.jsdelivr.net/npm/shiki@3.22.0/+esm' {
  export interface CodeToHtmlOptions {
    lang: string
    themes: {
      dark: string
      light: string
    }
  }

  export function codeToHtml(code: string, options: CodeToHtmlOptions): Promise<string>
}

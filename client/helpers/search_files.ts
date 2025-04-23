type SearchQuery = {
    search_bar_query: string;
    filters: string[];
    page: string;
  };
  
  type SearchResponse = {
    success: boolean;
    data: any;
  };
  
  export async function fetchSearchResults(query: SearchQuery): Promise<SearchResponse> {
    try {
      const response = await fetch('/api/files/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        return {
          success: false,
          data: result.error || "Unknown error occurred",
        };
      }
      console.log(result.data)
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        data: error instanceof Error ? error.message : "Unexpected error",
      };
    }
  }
  
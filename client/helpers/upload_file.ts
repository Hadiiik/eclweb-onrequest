type FileInfo = {
    file_name: string;
    file_description: string;
    categories: string[];
    file_url: string;
  };
  
  type UploadResponse = {
    success: boolean;
    data?: any;
    error?: string;
  };
  
  export async function uploadFileInfo(fileInfo: FileInfo): Promise<UploadResponse> {
    try {
      const response = await fetch('/api/files/upload', { // غير "/api/your-route-path" حسب مسار الـ API عندك
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileInfo),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Something went wrong',
        };
      }
  
      return {
        success: true,
        data: result.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Unexpected error occurred',
      };
    }
  }
  
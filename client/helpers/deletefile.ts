// utils/deleteFile.ts

export async function deleteFile(fileId: string): Promise<{ success: boolean }> {
    try {
        const response = await fetch("/api/files/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ file_id: fileId }),
        });

        if (response.ok) {
            return { success: true };
        } else {
            console.log("Failed to delete file:");
            return { success: false };
        }
    } catch (error) {
        console.log("Error deleting file:", error);
        return { success: false };
    }
}

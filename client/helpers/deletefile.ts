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
            return { success: false };
        }
    } catch (error) {
        return { success: false };
    }
}

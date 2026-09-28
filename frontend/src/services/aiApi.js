import { API, authHeaders } from "./apiClient";

export async function askAgent(question, { workspaceId, activeFile } = {}) {
    const response = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: authHeaders({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({
            question,
            workspace_id: workspaceId,
            active_file: activeFile ? {
                file_name: activeFile.name,
                file_path: activeFile.path,
                language: activeFile.language,
                content: activeFile.content,
            } : null,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.message || `AI request failed (${response.status})`);
    }

    return await response.json();
}

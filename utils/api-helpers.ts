import https from 'https';
import fetch from 'node-fetch';

export const BASE_URL = 'https://practice.expandtesting.com/notes/api';

// Allow self-signed certificates
const httpsAgent = new https.Agent({rejectUnauthorized: false});

export interface ApiResponse {
    status: number;
    body: any;
}

// Safe JSON parsing helper
async function safeJson(res: any): Promise<any> {
    try {
        return await res.json();
    } catch (err) {
        const text = await res.text().catch(() => '');
        console.error('Invalid JSON response. Status:', res.status);
        console.error('Response body:', text);
        throw new Error('Failed to parse JSON from response');
    }
}

// User APIs
export async function registerUser(name: string, email: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password}),
        agent: httpsAgent,
    });
    const body = await safeJson(res);
    return {status: res.status, body};
}

export async function loginUser(email: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        agent: httpsAgent,
    });
    const body = await safeJson(res);
    return {status: res.status, body};
}

export async function changePassword(currentPassword: string, newPassword: string, token: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'x-auth-token': token},
        body: JSON.stringify({currentPassword, newPassword}),
        agent: httpsAgent,
    });
    const body = await safeJson(res);
    return {status: res.status, body};
}

// Notes APIs
export async function createNote(
    title: string,
    description: string,
    category: string,
    completed: boolean,
    token: string
): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'x-auth-token': token},
        body: JSON.stringify({title, description, category, completed}),
        agent: httpsAgent,
    });
    const body = await safeJson(res);

    if (![200, 201].includes(res.status)) {
        console.error('Create Note failed. Status:', res.status, 'Body:', body);
    }

    return {status: res.status, body};
}

export async function getNotes(token: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: 'GET',
        headers: {'x-auth-token': token},
        agent: httpsAgent,
    });
    const body = await safeJson(res);
    return {status: res.status, body};
}

export async function updateNote(
    noteId: string,
    title: string,
    description: string,
    category: string,
    completed: boolean,
    token: string
): Promise<ApiResponse> {
    if (!noteId) throw new Error('Note ID is undefined');
    const res = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'x-auth-token': token},
        body: JSON.stringify({title, description, category, completed}),
        agent: httpsAgent,
    });
    const body = await safeJson(res);

    if (res.status !== 200) {
        console.error('Update Note failed. Status:', res.status, 'Body:', body);
    }

    return {status: res.status, body};
}

export async function deleteNote(noteId: string, token: string): Promise<ApiResponse> {
    if (!noteId) throw new Error('Note ID is undefined');
    const res = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {'x-auth-token': token},
        agent: httpsAgent,
    });
    const body = await safeJson(res);

    if (res.status !== 200) {
        console.error('Delete Note failed. Status:', res.status, 'Body:', body);
    }

    return {status: res.status, body};
}

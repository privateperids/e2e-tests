import { test, expect } from '@playwright/test';
import { registerUser, loginUser, changePassword, createNote, updateNote, deleteNote } from '../../utils/api-helpers';

let token: string;
let email: string;
let noteId: string;

const name = 'Test User';
email = `testuser_${Date.now()}@example.com`;
const password = 'Password123!';
const newPassword = 'NewPassword123!';

test.describe.serial('API E2E Scenarios', () => {

    test('Register a new user', async ({}, testInfo) => {
        const res = await registerUser(name, email, password);

        // Attach full response body to the test report
        await testInfo.attach('Register Response', {
            body: JSON.stringify(res.body, null, 2),
            contentType: 'application/json'
        });

        expect(res.status).toBe(201);
    });

    test('Login user to get token', async ({}, testInfo) => {
        const res = await loginUser(email, password);

        await testInfo.attach('Login Response', {
            body: JSON.stringify(res.body, null, 2),
            contentType: 'application/json'
        });

        expect(res.status).toBe(200);
        token = res.body.data?.token;
        expect(token).toBeTruthy();
    });

    test('Change password', async ({}, testInfo) => {
        const res = await changePassword(password, newPassword, token);

        await testInfo.attach('Change Password Response', {
            body: JSON.stringify(res.body, null, 2),
            contentType: 'application/json'
        });

        expect(res.status).toBe(200);
    });

    test('Create a note', async ({}, testInfo) => {
        const res = await createNote('Test Note', 'This is a test note', 'Work', false, token);

        await testInfo.attach('Create Note Response', {
            body: JSON.stringify(res.body, null, 2),
            contentType: 'application/json'
        });

        expect([200, 201]).toContain(res.status);

        noteId = res.body?.data?.id;
        if (!noteId) console.error('Create Note response body:', res.body);
        expect(noteId).toBeTruthy();
    });

    test('Update note', async ({}, testInfo) => {
        expect(noteId).toBeTruthy();
        const res = await updateNote(noteId, 'Updated Note', 'This note was updated.', 'Personal', false, token);

        await testInfo.attach('Update Note Response', {
            body: JSON.stringify(res.body, null, 2),
            contentType: 'application/json'
        });

        expect(res.status).toBe(200);
    });

    test('Delete note', async ({}, testInfo) => {
        expect(noteId).toBeTruthy();
        const res = await deleteNote(noteId, token);

        await testInfo.attach('Delete Note Response', {
            body: JSON.stringify(res.body, null, 2),
            contentType: 'application/json'
        });

        expect(res.status).toBe(200);
    });
});

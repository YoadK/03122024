import { readJsonFile, writeJsonFile } from "./file-handler";

// Fetch all items
export async function getAllItems(file: string): Promise<any[]> {
    return await readJsonFile(file);
}

// Fetch a single item by ID
export async function getItemById(file: string, id: number): Promise<any | null> {
    const data = await readJsonFile(file);
    return data.find((item: any) => item.id === id) || null;
}

// Add a new item
export async function addItem(file: string, newItem: any): Promise<any> {
    const data = await readJsonFile(file);
    const nextId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    const item = { id: nextId, ...newItem };
    data.push(item);
    await writeJsonFile(file, data);
    return item;
}

// Update an existing item
export async function updateItem(file: string, id: number, updatedFields: any): Promise<any | null> {
    const data = await readJsonFile(file);
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updatedFields };
    await writeJsonFile(file, data);
    return data[index];
}

// Delete an item
export async function deleteItem(file: string, id: number): Promise<boolean> {
    const data = await readJsonFile(file);
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    data.splice(index, 1);
    await writeJsonFile(file, data);
    return true;
}

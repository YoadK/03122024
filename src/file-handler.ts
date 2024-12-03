import fs from "fs/promises";
import path from "path";

// dynamically read and write from the provided JSON files.

// Generic function to read data from a JSON file
export async function readJsonFile(fileName: string): Promise<any> {
    const filePath = path.join(__dirname, fileName);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
}

// Generic function to write data to a JSON file
export async function writeJsonFile(fileName: string, data: any): Promise<void> {
    const filePath = path.join(__dirname, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

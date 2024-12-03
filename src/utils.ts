import * as xml2js from 'xml2js'; // Install using: npm install xml2js
import * as js2xmlparser from 'js2xmlparser'; // Install using: npm install js2xmlparser
import * as vkbeautify from 'vkbeautify'; // 
import axios, { AxiosRequestConfig } from 'axios';


// Convert JSON string to XML
export function fromJsonToXml(jsonString: string): string {
    try {
        const jsonObject = JSON.parse(jsonString);
        return js2xmlparser.parse("root", jsonObject); // Replace "root" with your desired root tag name
    } catch (error) {
        console.error("Error parsing JSON string:", error);
        throw new Error("Invalid JSON string");
    }
}

// Convert XML string to JSON
export function fromXmlToJson(xmlString: string): string {
    const parser = new xml2js.Parser();
    let resultJson: string = "";

    parser.parseString(xmlString, (err, result) => {
        if (err) {
            console.error("Error parsing XML string:", err);
            throw new Error("Invalid XML string");
        }
        resultJson = JSON.stringify(result);
    });

    return resultJson;
}



export async function sendHttpRequest(url: string, method: string, data: any = null): Promise<any> {
    try {
        const response = await axios({
            method,
            url,
            data,
        });
        return response.data;
    } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
    }
}

/**
 * Generic function to make API calls.
 * @param url - API endpoint.
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param data - Payload for POST/PUT requests (optional).
 * @param headers - Additional headers for the request (optional).
 */
export async function apiRequest(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    headers: Record<string, string> = {}
): Promise<any> {
    try {
        const config: AxiosRequestConfig = {
            url,
            method,
            data,
            headers,
        };

        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`API Request failed: ${error}`);
        throw new Error(error.response?.data?.message || error.message || 'API Error');
    }
}

export function isValidJson(jsonString: string): boolean {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}

import { parseString } from 'xml2js';

export function isValidXml(xmlString: string): boolean {
    try {
        const parser = new xml2js.Parser();
        parser.parseString(xmlString, () => {});
        return true;
    } catch {
        return false;
    }
}



export function getEnvVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} not found`);
    }
    return value;
}
export function base64Encode(data: string): string {
    return Buffer.from(data).toString('base64');
}

export function base64Decode(data: string): string {
    return Buffer.from(data, 'base64').toString('utf-8');
}
export function buildApiPayload(data: object, metadata: object): object {
    return { ...data, ...metadata };
}


export function beautifyXml(xmlString: string): string {
    return vkbeautify.xml(xmlString);
}

/**
 * Performs login and retrieves a token from the API.
 * @param loginUrl - Authentication endpoint.
 * @param credentials - User credentials (username and password or API key).
 */
export async function authenticateApi(
    loginUrl: string,
    credentials: { [key: string]: string }
): Promise<string> {
    try {
        const response = await axios.post(loginUrl, credentials);
        return response.data.token; // Assuming the token is in response.data.token
    } catch (error) {
        console.error(`Authentication failed: ${error}`);
        throw new Error('Invalid credentials or API authentication failed');
    }
}

/**
 * Makes an authenticated API request.
 * @param url - API endpoint.
 * @param method - HTTP method (GET, POST, etc.).
 * @param token - Authentication token.
 * @param data - Payload for POST/PUT requests (optional).
 */
export async function authenticatedApiRequest(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    token: string,
    data?: any
): Promise<any> {
    const headers = {
        Authorization: `Bearer ${token}`, // Adjust based on API requirements
        'Content-Type': 'application/json',
    };
    return apiRequest(url, method, data, headers);
}

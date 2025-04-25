import { Doctor } from "@/types";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Doctor[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    // In a real app, you might want to handle this error more gracefully
    // For now, we'll return an empty array or rethrow the error
    return [];
  }
} 
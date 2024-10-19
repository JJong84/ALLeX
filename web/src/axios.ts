import axios, { AxiosResponse } from 'axios';
// @ts-ignore
import { GetSubstanceObj, GetSubstancesInLab, Lab, LabWithSubs } from './types';

// Function to retrieve cookies by name
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return null; // Return null if the cookie is not found
}

// Create axios instance with custom configuration
const client = axios.create({
  baseURL: 'http://13.209.82.235:8000/',  // Set this to your FastAPI server URL
  withCredentials: true,  // Include credentials in requests (useful for cookies or sessions)
  headers: {
    'Access-Control-Allow-Credentials': true,  // Allow credentials to be passed in cross-origin requests
    'ngrok-skip-browser-warning': true,  // Custom header for bypassing ngrok warning
    Authorization: `Bearer ${getCookie('accessToken')}`,  // Set Bearer token using a cookie value
  },
});

const getLabs = async (): Promise<AxiosResponse<Lab[]>> => client.get('/labs/')

const createLab = async (labData: LabWithSubs): Promise<AxiosResponse<LabWithSubs>> => client.post('/labs/', labData)

const getExperiments = async () => {

}

const addExperiment = async () => {

}

const getSubstancesInLab = async (labId: number): Promise<AxiosResponse<GetSubstancesInLab>> => client.get(`/labs/${labId}/substances`)

// API function to get all available substances from the backend
const getSubstances = async (): Promise<AxiosResponse<GetSubstanceObj>> => client.get('/substances/');

// Export the axios instance for use in API requests
export {getLabs, getExperiments, addExperiment, getSubstances, getSubstancesInLab, createLab};
export default client;

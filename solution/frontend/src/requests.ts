import axios, { AxiosRequestConfig, AxiosError, isAxiosError } from 'axios';
import AppConfig from './appConfig';

const headers = {
  'Content-Type': 'application/json',
};

// Create a request configuration object
const config: AxiosRequestConfig = {
  headers: headers,
};


const errorHandler = (error: any) => {
  if (isAxiosError(error)) {
    // Axios error
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Server responded with an error status code
      throw Error('Server error: ' + JSON.stringify(axiosError.response.data));
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw Error('No response received:', axiosError.request);
    } else {
      // Something happened in setting up the request that triggered an error
      throw Error('Request error: ' + axiosError.message);
    }
  } else {
    // Non-Axios error
    throw Error('Generic error: ' + error.message);
  }
}


const fetchCompanies = async () => {
  try {
    const url = `${AppConfig.API_BASE_URL}/companies`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    errorHandler(error)
  }

}

const fetchTotals = async(currency: string, companyId: string) => {

  
  try {
    if (companyId && companyId === "") {
      throw Error("companyId is required.");
    }

    // GET /totals/?currency=eur&company_id=xx
    let queryParams = `?company_id=${companyId}`

    if (currency && currency !== "") {
      queryParams = `${queryParams}&currency=${currency}`
    }

    const url = `${AppConfig.API_BASE_URL}/totals${queryParams}`;
    const response = await axios.get(url, config);
    return response.data;

  } catch (error: any) {
    errorHandler(error);
  }
}


export { fetchCompanies, fetchTotals };


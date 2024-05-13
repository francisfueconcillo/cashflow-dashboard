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

// GET /companies   --- retrieves the first 500 companies
const fetchCompanies = async () => {
  try {
    const url = `${AppConfig.API_BASE_URL}/companies`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    errorHandler(error)
  }
}

// GET /companies/?q=<query>   --- retrieves the first 500 companies filtered by a a query string
const searchCompanies = async (query: string) => {
  try {
    const url = `${AppConfig.API_BASE_URL}/companies?q=${query}`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    errorHandler(error)
  }
}

// GET /totals/?currency=eur&company_id=xx
const fetchTotals = async(currency: string, companyId: string, fromDate: Date, toDate: Date) => {
  try {
    if (companyId && companyId === "") {
      throw Error("companyId is required.");
    }
    
    let queryParams = `?company_id=${companyId}`

    if (currency && currency !== "") {
      queryParams = `${queryParams}&currency=${currency}`
    }

    if (fromDate && toDate) {
      queryParams = `${queryParams}&start_date=${fromDate.toISOString()}&end_date=${toDate.toISOString()}`
    }


    const url = `${AppConfig.API_BASE_URL}/totals${queryParams}`;
    const response = await axios.get(url, config);
    return response.data;

  } catch (error: any) {
    errorHandler(error);
  }
}


// GET /transactions/?currency=eur&agg=day&&company_id=xx   (aggregation = day|month|country, default: month)
const fetchTransactions = async (currency: string, companyId: string, fromDate: Date, toDate: Date, aggregate?: string) => {
  try {
    if (companyId && companyId === "") {
      throw Error("companyId is required.");
    }
    
    let queryParams = `?company_id=${companyId}`

    if (currency && currency !== "") {
      queryParams = `${queryParams}&currency=${currency}`
    }

    if (aggregate && aggregate !== "") {
      queryParams = `${queryParams}&agg=${aggregate}`
    }

    if (fromDate && toDate) {
      queryParams = `${queryParams}&start_date=${fromDate.toISOString()}&end_date=${toDate.toISOString()}`
    }

    const url = `${AppConfig.API_BASE_URL}/transactions${queryParams}`;
    const response = await axios.get(url, config);
    return response.data;

  } catch (error: any) {
    errorHandler(error);
  }
}






export { fetchCompanies, fetchTotals, fetchTransactions, searchCompanies };


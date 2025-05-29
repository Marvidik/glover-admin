
const BASE_URL = 'https://banking.pythonanywhere.com';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    password: string;
  };
}

interface DashboardMetrics {
  total_users: number;
  verified_accounts: number;
  total_balance: string;
  pending_transactions: number;
  banned_users: number;
  monthly_growth_percent: number;
}

interface User {
  id: number;
  username: string;
  account_type: string;
  status: string;
  balance: string;
  join_date: string;
  email: string;
}

interface UserProfile {
  user: {
    id: number;
    username: string;
    email: string;
    password: string;
  };
  profile: {
    id: number;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    ssn: string;
    email: string;
    phone_number: string;
    occupation: string;
    id_type: string;
    passport: string;
    client_id: string;
    id_number: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    account_number: string;
    verified: boolean;
    account_type: string;
    balance: string;
    pending_balance: string;
    user: number;
  };
  security_answers: {
    id: number;
    ans1: string;
    ans2: string;
    user: number;
  };
  transaction_pin: {
    id: number;
    transfer_pin: number;
    user: number;
  };
  otp: {
    user: number;
    otp: string;
  };
}

interface Transaction {
  id: number;
  user: number;
  recipient_name: string;
  recipient_account_number: string;
  recipient_routing_number: string;
  recipient_bank_name: string;
  amount: string;
  status_type: string;
  date: string;
  transaction_type: string;
}

interface BankCodes {
  id: number;
  imfcode: string;
  ipncode: string;
  bank_transfercode: string;
}

interface LoginPin {
  id: number;
  pin: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    
    return headers;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/login/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await fetch(`${BASE_URL}/super/dashboard/metrics/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard metrics');
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/super/users/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/super/users/${userId}/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  async banUser(userId: number, ban: boolean): Promise<{ user: string; banned: boolean }> {
    const response = await fetch(`${BASE_URL}/super/users/${userId}/ban/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ban }),
    });

    if (!response.ok) {
      throw new Error('Failed to update ban status');
    }

    return response.json();
  }

  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${BASE_URL}/super/transactions/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  }

  async getTransaction(transactionId: number): Promise<Transaction> {
    const response = await fetch(`${BASE_URL}/super/transactions/${transactionId}/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }

    return response.json();
  }

  async approveTransaction(transactionId: number): Promise<{ detail: string }> {
    const response = await fetch(`${BASE_URL}/super/transactions/${transactionId}/approve/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to approve transaction');
    }

    return response.json();
  }

  async getBankCodes(): Promise<BankCodes> {
    const response = await fetch(`${BASE_URL}/super/manage/codes/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bank codes');
    }

    return response.json();
  }

  async updateBankCodes(codes: Partial<BankCodes>): Promise<BankCodes> {
    const response = await fetch(`${BASE_URL}/super/manage/codes/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(codes),
    });

    if (!response.ok) {
      throw new Error('Failed to update bank codes');
    }

    return response.json();
  }

  async getLoginPin(): Promise<LoginPin> {
    const response = await fetch(`${BASE_URL}/super/manage/login-pin/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch login pin');
    }

    return response.json();
  }

  async updateLoginPin(pin: number): Promise<LoginPin> {
    const response = await fetch(`${BASE_URL}/super/manage/login-pin/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ pin }),
    });

    if (!response.ok) {
      throw new Error('Failed to update login pin');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export type { User, UserProfile, Transaction, DashboardMetrics, BankCodes, LoginPin };

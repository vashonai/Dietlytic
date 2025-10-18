// Simple authentication service with test credentials
export interface User {
    id: string;
    email: string;
    name: string;
    age?: number;
    weight?: number;
    height?: number;
    activity_level: string;
    goal: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
}

class AuthService {
    private currentUser: User | null = null;
    private isAuthenticated: boolean = false;
    private listeners: ((state: AuthState) => void)[] = [];

    // Default test credentials
    private readonly TEST_CREDENTIALS = {
        'test@dietlytic.com': 'password123',
        'demo@dietlytic.com': 'demo123',
        'admin@dietlytic.com': 'admin123'
    };

    // Default user profiles
    private readonly USER_PROFILES = {
        'test@dietlytic.com': {
            id: 'user-001',
            email: 'test@dietlytic.com',
            name: 'Test User',
            age: 25,
            weight: 70,
            height: 175,
            activity_level: 'moderate',
            goal: 'maintain'
        },
        'demo@dietlytic.com': {
            id: 'user-002',
            email: 'demo@dietlytic.com',
            name: 'Demo User',
            age: 30,
            weight: 65,
            height: 165,
            activity_level: 'active',
            goal: 'lose'
        },
        'admin@dietlytic.com': {
            id: 'user-003',
            email: 'admin@dietlytic.com',
            name: 'Admin User',
            age: 35,
            weight: 80,
            height: 180,
            activity_level: 'very_active',
            goal: 'gain'
        }
    };

    constructor() {
        // Check if user is already logged in (from previous session)
        this.loadStoredAuth();
    }

    // Load authentication state from storage
    private loadStoredAuth() {
        try {
            // In a real app, you'd use AsyncStorage or SecureStore
            // For now, we'll just check if there's a stored user
            const storedUser = this.getStoredUser();
            if (storedUser) {
                this.currentUser = storedUser;
                this.isAuthenticated = true;
                this.notifyListeners();
            }
        } catch (error) {
            console.log('No stored authentication found');
        }
    }

    // Store user data (simplified version)
    private storeUser(user: User) {
        try {
            // In a real app, use AsyncStorage
            localStorage.setItem('dietlytic_user', JSON.stringify(user));
        } catch (error) {
            console.log('Could not store user data');
        }
    }

    // Get stored user data
    private getStoredUser(): User | null {
        try {
            const stored = localStorage.getItem('dietlytic_user');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    }

    // Clear stored user data
    private clearStoredUser() {
        try {
            localStorage.removeItem('dietlytic_user');
        } catch (error) {
            console.log('Could not clear stored user data');
        }
    }

    // Login with email and password
    async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check credentials
            if (!this.TEST_CREDENTIALS[email as keyof typeof this.TEST_CREDENTIALS]) {
                return { success: false, error: 'Invalid email address' };
            }

            if (this.TEST_CREDENTIALS[email as keyof typeof this.TEST_CREDENTIALS] !== password) {
                return { success: false, error: 'Incorrect password' };
            }

            // Get user profile
            const userProfile = this.USER_PROFILES[email as keyof typeof this.USER_PROFILES];
            if (!userProfile) {
                return { success: false, error: 'User profile not found' };
            }

            // Set authentication state
            this.currentUser = userProfile;
            this.isAuthenticated = true;

            // Store user data
            this.storeUser(userProfile);

            // Notify listeners
            this.notifyListeners();

            console.log('Login successful:', userProfile.name);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    // Logout
    async logout(): Promise<void> {
        try {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.clearStoredUser();
            this.notifyListeners();
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUser;
    }

    // Check if user is authenticated
    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }

    // Get authentication state
    getAuthState(): AuthState {
        return {
            isAuthenticated: this.isAuthenticated,
            user: this.currentUser,
            isLoading: false
        };
    }

    // Add authentication state listener
    addAuthListener(listener: (state: AuthState) => void): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners of state change
    private notifyListeners() {
        const state = this.getAuthState();
        this.listeners.forEach(listener => listener(state));
    }

    // Get available test accounts
    getTestAccounts(): Array<{ email: string; name: string; password: string }> {
        return [
            { email: 'test@dietlytic.com', name: 'Test User', password: 'password123' },
            { email: 'demo@dietlytic.com', name: 'Demo User', password: 'demo123' },
            { email: 'admin@dietlytic.com', name: 'Admin User', password: 'admin123' }
        ];
    }
}

export const authService = new AuthService();

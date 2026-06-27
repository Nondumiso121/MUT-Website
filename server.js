const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

console.log('🚀 Server starting...');

// In-memory storage (no file writing needed)
let users = [];

// Create default test user
const defaultUser = {
    id: '1',
    student_id: '20240001',
    full_name: 'Thabo Student',
    email: 'student@mut.ac.za',
    phone: '0712345678',
    program: 'Diploma in IT',
    year_level: '2',
    password: bcrypt.hashSync('password123', 10),
    created_at: new Date().toISOString()
};
users.push(defaultUser);

console.log(`✅ Created default test user`);
console.log(`📊 Users in memory: ${users.length}`);

// ==================== API ENDPOINTS ====================

// REGISTER endpoint
app.post('/api/register', async (req, res) => {
    console.log('📝 Register request received');
    console.log('Request body:', req.body);
    
    try {
        const { student_id, full_name, email, password, confirm_password, program, year_level, phone } = req.body;

        // Validation
        if (!student_id || !full_name || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }

        if (password !== confirm_password) {
            console.log('❌ Passwords do not match');
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            console.log('❌ Password too short');
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = users.find(u => u.student_id === student_id || u.email === email);
        if (existingUser) {
            console.log('❌ User already exists:', student_id);
            return res.status(409).json({ success: false, message: 'Student ID or Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            student_id,
            full_name,
            email,
            phone: phone || '',
            program: program || '',
            year_level: year_level || '1',
            password: hashedPassword,
            created_at: new Date().toISOString()
        };

        users.push(newUser);
        console.log(`✅ User registered successfully: ${student_id} (${full_name})`);
        console.log(`📊 Total users: ${users.length}`);

        res.json({ success: true, message: 'Registration successful! Please login.' });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

// LOGIN endpoint
app.post('/api/login', async (req, res) => {
    console.log('🔐 Login request received');
    console.log('Request body:', req.body);
    
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            console.log('❌ Missing login credentials');
            return res.status(400).json({ success: false, message: 'Please provide login credentials' });
        }

        // Find user by student_id or email
        const user = users.find(u => u.student_id === login || u.email === login);

        if (!user) {
            console.log('❌ User not found:', login);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('❌ Invalid password for:', login);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, student_id: user.student_id, email: user.email },
            'your_secret_key_2026',
            { expiresIn: '7d' }
        );

        console.log(`✅ User logged in: ${user.student_id} (${user.full_name})`);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                student_id: user.student_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                program: user.program,
                year_level: user.year_level
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

// CHECK AUTH endpoint
app.get('/api/check-auth', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key_2026');
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                student_id: user.student_id,
                full_name: user.full_name,
                email: user.email,
                program: user.program,
                year_level: user.year_level
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

// GET all users (for testing)
app.get('/api/users', (req, res) => {
    const safeUsers = users.map(u => ({
        id: u.id,
        student_id: u.student_id,
        full_name: u.full_name,
        email: u.email,
        program: u.program,
        year_level: u.year_level
    }));
    res.json({ users: safeUsers, count: safeUsers.length });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 SERVER RUNNING ON http://localhost:${PORT}`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\n📝 API Endpoints:`);
    console.log(`   POST   http://localhost:${PORT}/api/register  - Create new account`);
    console.log(`   POST   http://localhost:${PORT}/api/login     - Login to account`);
    console.log(`   GET    http://localhost:${PORT}/api/users     - View all users`);
    console.log(`   GET    http://localhost:${PORT}/api/test      - Test API`);
    console.log(`\n🔐 TEST ACCOUNT:`);
    console.log(`   Student ID: 20240001`);
    console.log(`   Password: password123`);
    console.log(`   Email: student@mut.ac.za`);
    console.log(`\n💡 Open browser: http://localhost:${PORT}`);
    console.log(`${'='.repeat(50)}\n`);
});
# 🔐 Vulnerable 2FA Practice Lab

A deliberately vulnerable **Two-Factor Authentication (2FA) training lab** built with Node.js and Express.
This lab helps security researchers, penetration testers, and bug bounty hunters practice **2FA bypass techniques and authentication vulnerabilities**.

The application intentionally includes multiple insecure implementations so they can be discovered and exploited during testing.

---

# ⚠️ Disclaimer

This project is **intentionally vulnerable** and created **only for educational purposes**.
Do not deploy this application on the internet or production environments.

Use it only in a **local testing environment**.

---

# 📚 Vulnerabilities Included

This lab contains multiple common authentication and business-logic vulnerabilities:

1. Direct 2FA bypass
2. Response manipulation
3. Status code manipulation
4. Referrer check bypass
5. Client-side OTP validation flaw
6. IP header bypass (`X-Forwarded-For`)
7. Session permission issues
8. OTP reuse
9. OTP sharing between accounts
10. OTP leakage in response
11. OTP brute force (no rate limiting)
12. CSRF to disable 2FA
13. Arbitrary OTP input bypass

---

# 🧰 Requirements

* Node.js
* npm
* Web browser
* Burp Suite (recommended for testing)

---

# ⚙️ Installation

Clone or download the project.

```bash
git clone https://github.com/yourname/2fa-lab.git
cd 2fa-lab
```

Install dependencies:

```bash
npm install express express-session body-parser
```

---

# ▶️ Running the Lab

Start the server:

```bash
node app.js
```

You should see:

```text
2FA Lab running at http://localhost:3000
```

Open in browser:

```text
http://localhost:3000
```

---

# 👤 Test Credentials

Admin user:

```text
Username: admin
Password: admin123
```

Victim user:

```text
Username: victim
Password: victim123
```

---

# 🔑 Application Flow

```
Login → OTP Verification → Dashboard
```

Users must normally complete OTP verification before accessing the dashboard.

However, the application contains multiple flaws allowing bypass of this protection.

---

# 🧪 Testing Guide

## 1. Direct 2FA Bypass

1. Login using valid credentials.
2. Do not enter the OTP.
3. Navigate directly to:

```
http://localhost:3000/dashboard
```

If successful, the dashboard loads without completing OTP verification.

---

## 2. Response Manipulation

Using Burp Suite Proxy:

Intercept:

```
POST /verify-otp
```

Send incorrect OTP:

```
otp=111111
```

Modify the server response before forwarding.

Example change:

```
OTP incorrect → OTP correct
```

---

## 3. Status Code Manipulation

Intercept response:

```
HTTP/1.1 401 Unauthorized
```

Change to:

```
HTTP/1.1 200 OK
```

If the client trusts only HTTP status codes, authentication may be bypassed.

---

## 4. Referrer Check Bypass

Endpoint:

```
/secure
```

Send request with header:

```
Referer: http://localhost:3000/otp
```

This may trick the application into thinking OTP was completed.

---

## 5. Client-Side Validation Bypass

Open browser console and inspect JavaScript validation functions such as:

```
checkOTP()
```

Client-side checks can be bypassed or modified.

---

## 6. IP Header Bypass

Endpoint:

```
/ip-protected
```

Modify request header:

```
X-Forwarded-For: 127.0.0.1
```

Some applications trust internal IP addresses.

---

## 7. Session Permission Issue

Login with two accounts in different browsers.

Reuse session cookies between users to test whether session permissions are correctly isolated.

---

## 8. OTP Reuse

Use the same OTP multiple times.

If OTP is not invalidated after use, it can be replayed.

---

## 9. OTP Sharing

Attempt to use an OTP generated for one user to authenticate another account.

---

## 10. OTP Leakage

Observe login response for exposed OTP values:

```
Debug OTP: 123456
```

Sensitive information should never be exposed to users.

---

## 11. OTP Brute Force

OTP range:

```
000000 – 999999
```

Send requests to:

```
POST /verify-otp
```

Use Burp Intruder to automate attempts.

If no rate limiting exists, OTP can be brute-forced.

---

## 12. CSRF Disable 2FA

Endpoint:

```
POST /disable-2fa
```

If no CSRF protection exists, an attacker can disable 2FA through a malicious website.

---

## 13. Arbitrary OTP Input

Test invalid inputs such as:

```
0
null
AAAAAA
000000
```

Improper validation may allow bypass.

---

# 🧪 Useful Endpoints

```
/verify-otp
/dashboard
/secure
/ip-protected
/disable-2fa
/logout
```

---

# 🛠 Recommended Testing Tools

* Burp Suite
* OWASP ZAP
* Browser Developer Tools

---

# 📖 Learning Objectives

This lab helps practice:

* Authentication testing
* Session management flaws
* Business logic vulnerabilities
* 2FA bypass techniques
* Bug bounty methodologies

---

# 👨‍💻 Author

Created for security training and bug bounty practice.

---

# ⭐ Contribution

Feel free to improve the lab by adding:

* API authentication vulnerabilities
* JWT attacks
* Password reset flaws
* OAuth bypass
* IDOR vulnerabilities

---

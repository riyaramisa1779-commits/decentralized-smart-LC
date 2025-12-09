# Pinata IPFS Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ☐ Step 1: Pinata Account Setup

- [ ] Created account at https://www.pinata.cloud/
- [ ] Verified email address
- [ ] Logged into Pinata dashboard

## ☐ Step 2: API Key Generation

- [ ] Navigated to API Keys section
- [ ] Clicked "New Key" or "Generate New Key"
- [ ] Enabled required permissions:
  - [ ] `pinFileToIPFS`
  - [ ] `unpin` (optional)
  - [ ] `pinList` (optional)
- [ ] Copied API Key
- [ ] Copied API Secret
- [ ] Stored keys securely (you can't see the secret again!)

## ☐ Step 3: Environment Configuration

- [ ] Navigated to `ui` directory
- [ ] Created `.env` file from `.env.example`
  ```bash
  copy .env.example .env
  ```
- [ ] Updated `.env` with Pinata credentials:
  - [ ] `VITE_PINATA_API_KEY=your_actual_key`
  - [ ] `VITE_PINATA_SECRET_KEY=your_actual_secret`
  - [ ] `VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/`
- [ ] Verified no extra spaces or quotes around values
- [ ] Confirmed `.env` is in `.gitignore` (should be by default)

## ☐ Step 4: Development Server

- [ ] Opened terminal in `ui` directory
- [ ] Installed dependencies (if not already done):
  ```bash
  npm install
  ```
- [ ] Started development server:
  ```bash
  npm run dev
  ```
- [ ] Server started without errors
- [ ] Application opened in browser

## ☐ Step 5: Test Upload

- [ ] Navigated to Document Management page
- [ ] Connected wallet (if required)
- [ ] Clicked "Choose Files" button
- [ ] Selected a test file (PDF, JPG, PNG, DOC, or DOCX)
- [ ] Saw upload progress bar
- [ ] Upload completed successfully
- [ ] Document appeared in list with IPFS hash

## ☐ Step 6: Verify in Pinata Dashboard

- [ ] Opened Pinata dashboard in browser
- [ ] Navigated to "Files" section
- [ ] Found uploaded file in list
- [ ] Verified file details match

## ☐ Step 7: Test View & Download

- [ ] Clicked eye icon on uploaded document
- [ ] Document opened in new tab via IPFS gateway
- [ ] Clicked download icon
- [ ] File downloaded successfully to local machine

## ☐ Step 8: Test Error Handling

- [ ] Tried uploading file larger than 10MB
  - [ ] Saw appropriate error message
- [ ] Tried uploading unsupported file type
  - [ ] Saw appropriate error message
- [ ] Verified error messages are user-friendly

## ☐ Optional: Advanced Testing

- [ ] Ran connection test in browser console:
  ```javascript
  import('./utils/testPinata').then(m => m.testPinataConnection())
  ```
- [ ] Tested with different file types (PDF, images, documents)
- [ ] Tested upload cancellation (if implemented)
- [ ] Checked browser console for errors
- [ ] Verified network requests in DevTools

## 🎉 Success Criteria

All of the following should be true:

✅ Files upload successfully to Pinata
✅ IPFS hash is generated and displayed
✅ Files appear in Pinata dashboard
✅ Files can be viewed via IPFS gateway
✅ Files can be downloaded
✅ Error messages display correctly
✅ No console errors during upload

## 🐛 Troubleshooting

If any step fails, refer to:
- `PINATA_SETUP_GUIDE.md` - Detailed setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- Browser console for error messages
- Pinata dashboard for API key status

## 📝 Notes

- Free tier limits: 1GB storage, 100GB bandwidth/month
- Files are publicly accessible via IPFS hash
- Consider encryption for sensitive documents
- API keys should never be committed to version control

## ✅ Completion

Date completed: _______________

Tested by: _______________

Notes: _______________________________________________

_____________________________________________________

_____________________________________________________

# Document Upload Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                  (DocumentManagement.tsx)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 1. User selects file
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      File Validation                            │
│                   (fileValidation.ts)                           │
│  • Check file type (PDF, JPG, PNG, DOC, DOCX)                 │
│  • Check file size (max 10MB)                                  │
│  • Return validation result                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 2. If valid
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Pinata Service                             │
│                   (pinata.service.ts)                           │
│  • Create FormData with file                                    │
│  • Add metadata (name, date, type, size)                       │
│  • Upload via XMLHttpRequest                                    │
│  • Track progress                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 3. Upload to Pinata
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Pinata API                              │
│                  (api.pinata.cloud)                             │
│  • Receive file and metadata                                    │
│  • Pin to IPFS network                                          │
│  • Generate IPFS hash (CID)                                     │
│  • Return response                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 4. Return IPFS hash
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Document Storage                             │
│                  (Component State)                              │
│  • Store document metadata                                      │
│  • Store IPFS hash                                              │
│  • Update UI with new document                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Upload Flow

### Phase 1: User Interaction
```
User clicks "Choose Files"
    ↓
File input dialog opens
    ↓
User selects file
    ↓
onChange event triggered
    ↓
handleFileUpload() called
```

### Phase 2: Validation
```
Extract file from event
    ↓
Call validateFile(file)
    ↓
Check file.type against ALLOWED_FILE_TYPES
    ↓
Check file.size against MAX_FILE_SIZE (10MB)
    ↓
Return { valid: boolean, error?: string }
    ↓
If invalid → Display error → Stop
    ↓
If valid → Continue to upload
```

### Phase 3: Upload Preparation
```
Set uploadingFile state
    ↓
Set uploadProgress to 0
    ↓
Clear any previous errors
    ↓
Create FormData object
    ↓
Append file to FormData
    ↓
Append metadata (JSON):
    • name: file.name
    • uploadedAt: ISO timestamp
    • fileType: file.type
    • fileSize: file.size
    ↓
Append options (JSON):
    • cidVersion: 1
```

### Phase 4: Upload Execution
```
Create XMLHttpRequest
    ↓
Attach progress listener
    ↓
Attach load listener
    ↓
Attach error listener
    ↓
Set request headers:
    • pinata_api_key
    • pinata_secret_api_key
    ↓
Send POST to /pinning/pinFileToIPFS
    ↓
Monitor upload progress
    ↓
Update progress bar in real-time
```

### Phase 5: Response Handling
```
Receive response from Pinata
    ↓
Parse JSON response
    ↓
Extract IpfsHash (CID)
    ↓
Create document object:
    • id: timestamp
    • name: file.name
    • type: file.type
    • hash: IpfsHash
    • uploadedAt: current date
    • status: 'pending'
    • size: formatted size
    • dealId: current deal
    ↓
Add to uploadedDocuments state
    ↓
Display success message
    ↓
Reset upload state after 1 second
```

### Phase 6: Error Handling
```
If error occurs at any step
    ↓
Catch error
    ↓
Log to console
    ↓
Set uploadError state
    ↓
Display error message to user
    ↓
Reset upload state
    ↓
Clear file input
```

## View/Download Flow

### View Document
```
User clicks eye icon
    ↓
handleViewDocument(hash) called
    ↓
pinataService.getGatewayUrl(hash)
    ↓
Construct URL: gateway + hash
    ↓
window.open(url, '_blank')
    ↓
Document opens in new tab
```

### Download Document
```
User clicks download icon
    ↓
handleDownloadDocument(hash, filename) called
    ↓
Fetch file from IPFS gateway
    ↓
Convert response to Blob
    ↓
Create object URL
    ↓
Create temporary <a> element
    ↓
Set href and download attributes
    ↓
Trigger click
    ↓
Clean up (remove element, revoke URL)
    ↓
File saved to user's downloads
```

## State Management

### Component State
```typescript
uploadingFile: File | null          // Currently uploading file
uploadProgress: number              // 0-100 percentage
uploadError: string | null          // Error message if any
uploadedDocuments: Document[]       // List of uploaded docs
```

### Document Object
```typescript
{
  id: number                        // Unique identifier
  name: string                      // Original filename
  type: string                      // MIME type
  hash: string                      // IPFS CID
  uploadedAt: string                // ISO date string
  status: 'verified' | 'pending' | 'rejected'
  size: string                      // Formatted size
  dealId: number                    // Associated deal
}
```

## API Endpoints

### Pinata API
```
POST https://api.pinata.cloud/pinning/pinFileToIPFS
Headers:
  - pinata_api_key: YOUR_API_KEY
  - pinata_secret_api_key: YOUR_SECRET_KEY
Body: FormData
  - file: File
  - pinataMetadata: JSON string
  - pinataOptions: JSON string

Response:
{
  IpfsHash: string      // IPFS CID
  PinSize: number       // Size in bytes
  Timestamp: string     // ISO timestamp
}
```

### IPFS Gateway
```
GET https://gateway.pinata.cloud/ipfs/{IpfsHash}
No authentication required
Returns: File content
```

## Error Scenarios

1. **Invalid File Type**
   - Detected: Validation phase
   - Message: "Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX"
   - Action: Stop upload, show error

2. **File Too Large**
   - Detected: Validation phase
   - Message: "File size exceeds 10MB limit. Your file is X.XX MB"
   - Action: Stop upload, show error

3. **Missing API Credentials**
   - Detected: Upload phase
   - Message: "Pinata API credentials are not configured"
   - Action: Stop upload, show error

4. **Network Error**
   - Detected: Upload phase
   - Message: "Network error during upload"
   - Action: Stop upload, show error

5. **API Error**
   - Detected: Upload phase
   - Message: "Upload failed with status XXX"
   - Action: Stop upload, show error

## Performance Considerations

- **Progress Tracking**: Uses XMLHttpRequest for real-time progress
- **File Size Limit**: 10MB to prevent long uploads
- **Async Operations**: All uploads are non-blocking
- **Error Recovery**: Clear error states allow retry
- **Memory Management**: Object URLs are revoked after download

## Security Considerations

- **API Keys**: Stored in environment variables, never in code
- **File Validation**: Client-side validation (server-side recommended)
- **Public Access**: All IPFS files are publicly accessible
- **HTTPS**: All API calls use secure connections
- **CORS**: Handled by Pinata API

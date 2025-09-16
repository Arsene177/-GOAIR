from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import base64

def generate_vapid_keys():
    # Generate key pair
    private_key = ec.generate_private_key(ec.SECP256R1())
    public_key = private_key.public_key()
    
    # Convert to raw bytes
    public_raw = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )
    private_raw = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    # Convert to base64
    public_b64 = base64.urlsafe_b64encode(public_raw).decode('utf-8')
    private_b64 = base64.urlsafe_b64encode(private_raw).decode('utf-8')
    
    # Save to .env files
    with open('.env', 'a') as f:
        f.write(f"\nVAPID_PUBLIC_KEY={public_b64}")
        f.write(f"\nVAPID_PRIVATE_KEY={private_b64}")
    
    with open('../frontend/.env', 'a') as f:
        f.write(f"\nVITE_VAPID_PUBLIC_KEY={public_b64}")
    
    print("VAPID keys have been generated and saved to .env files")
    print("Public key:", public_b64)
    print("Private key:", private_b64)

if __name__ == "__main__":
    generate_vapid_keys()
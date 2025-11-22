import os
from pathlib import Path
from dotenv import load_dotenv

# 1. 确定 .env 文件的绝对路径
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"

print(f"Testing .env path: {env_path}")
print(f"File exists?: {env_path.exists()}")

# 2. 尝试加载
load_dotenv(dotenv_path=env_path)

# 3. 读取 Key
api_key = os.getenv("OPENAI_API_KEY")

print("-" * 20)
if api_key:
    # 成功读取，打印前几位
    print(f"SUCCESS! API Key found: {api_key[:5]}......")
else:
    # 读取失败
    print("FAILURE. No API Key found.")
print("-" * 20)
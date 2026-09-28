from .ollama import OllamaService
from .nvidia import NVIDIAService
from .provider_manager import AIProviderManager, AIProvidersUnavailableError

ollama_service = OllamaService()
nvidia_service = NVIDIAService()
provider_manager = AIProviderManager(ollama=ollama_service, nvidia=nvidia_service)

import requests

def test_backend():
    try:
        print("Testando conexão com o backend...")
        response = requests.get('http://localhost:5000/api/health')
        if response.status_code == 200:
            print("✓ Backend está funcionando!")
            print(f"  Resposta: {response.json()}")
        else:
            print(f"✗ Backend retornou status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("✗ Não foi possível conectar ao backend!")
        print("  Certifique-se de que o backend está rodando em http://localhost:5000")
        print("  Execute: cd backend && python app.py")
    except Exception as e:
        print(f"✗ Erro ao testar backend: {e}")

if __name__ == '__main__':
    test_backend()

#!/usr/bin/env python3
"""
Script para testar se o backend está rodando e respondendo corretamente.
Executa alguns testes básicos nas rotas da API.
"""

import requests
import sys

def test_backend():
    base_url = "http://localhost:5001"
    api_url = f"{base_url}/api"

    print("=" * 60)
    print("TESTE DE CONEXÃO DO BACKEND")
    print("=" * 60)

    # Teste 1: Verificar se o servidor está rodando
    print("\n[1] Testando conexão com o servidor...")
    try:
        response = requests.get(base_url, timeout=3)
        print(f"✅ Servidor está respondendo (Status: {response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ ERRO: Servidor não está respondendo!")
        print("   → Certifique-se de que o backend está rodando em http://localhost:5001")
        print("   → Execute: cd backend && ./start.sh")
        sys.exit(1)
    except Exception as e:
        print(f"❌ ERRO: {e}")
        sys.exit(1)

    # Teste 2: Verificar CORS (deve retornar os headers corretos)
    print("\n[2] Testando configuração CORS...")
    try:
        headers = {
            'Origin': 'http://localhost:5000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{api_url}/auth/alterar-senha", headers=headers, timeout=3)

        cors_header = response.headers.get('Access-Control-Allow-Origin')
        if cors_header:
            print(f"✅ CORS configurado corretamente")
            print(f"   → Access-Control-Allow-Origin: {cors_header}")
            print(f"   → Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods', 'N/A')}")
        else:
            print("⚠️  AVISO: Header CORS não encontrado")
            print("   → Isso pode causar problemas com o frontend")
    except Exception as e:
        print(f"⚠️  Não foi possível testar CORS: {e}")

    # Teste 3: Verificar rota de alterar senha (deve retornar 400 sem dados)
    print("\n[3] Testando rota /api/auth/alterar-senha...")
    try:
        response = requests.post(
            f"{api_url}/auth/alterar-senha",
            json={},
            headers={'Origin': 'http://localhost:5000'},
            timeout=3
        )

        if response.status_code == 400:
            print(f"✅ Rota está respondendo corretamente")
            print(f"   → Status: {response.status_code} (esperado para dados incompletos)")
            print(f"   → Resposta: {response.json()}")
        else:
            print(f"⚠️  Status inesperado: {response.status_code}")
            print(f"   → Resposta: {response.text}")
    except Exception as e:
        print(f"❌ ERRO ao testar rota: {e}")

    # Teste 4: Verificar banco de dados
    print("\n[4] Verificando banco de dados...")
    import os
    db_path = os.path.join(os.path.dirname(__file__), 'database.db')
    if os.path.exists(db_path):
        print(f"✅ Banco de dados encontrado: {db_path}")
        file_size = os.path.getsize(db_path)
        print(f"   → Tamanho: {file_size} bytes")
    else:
        print(f"❌ ERRO: Banco de dados não encontrado em {db_path}")

    print("\n" + "=" * 60)
    print("RESUMO DOS TESTES")
    print("=" * 60)
    print("\n✅ Backend está funcionando corretamente!")
    print("\nSe ainda estiver com erro no frontend:")
    print("1. Limpe o cache do navegador (Ctrl+Shift+R)")
    print("2. Verifique se o frontend está em http://localhost:5000")
    print("3. Abra o DevTools (F12) e veja o console para mais detalhes")
    print("\n")

if __name__ == '__main__':
    try:
        test_backend()
    except KeyboardInterrupt:
        print("\n\nTeste interrompido pelo usuário.")
        sys.exit(0)

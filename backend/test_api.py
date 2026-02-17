#!/usr/bin/env python3
"""Script de teste para a API de usuários"""

import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_get_usuarios():
    """Testa GET /api/usuarios"""
    print("\n=== Testando GET /api/usuarios ===")
    try:
        response = requests.get(f'{BASE_URL}/usuarios', timeout=5)
        print(f"Status: {response.status_code}")
        if response.ok:
            usuarios = response.json()
            print(f"Total de usuários: {len(usuarios)}")
            for u in usuarios[:3]:
                print(f"  - {u['nome_completo']} ({u['cargo']})")
        else:
            print(f"Erro: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {e}")

def test_post_usuario():
    """Testa POST /api/usuarios"""
    print("\n=== Testando POST /api/usuarios ===")

    usuario_teste = {
        "nome_completo": "Teste API",
        "email": f"teste.api.{datetime.now().timestamp()}@example.com",
        "cpf": "12345678901",
        "telefone": "82999999999",
        "profissao": "Enfermeiro",
        "vinculo_empregaticio": "CLT",
        "cep": "57000000",
        "municipio": "Maceió",
        "logradouro": "Rua Teste",
        "bairro": "Centro",
        "numero": "123",
        "complemento": "Apto 1",
        "cargo": "Visitante",
        "senha_hash": "senha123",
        "criado_por": 1
    }

    try:
        response = requests.post(
            f'{BASE_URL}/usuarios',
            json=usuario_teste,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        if response.ok:
            print("✓ Usuário criado com sucesso!")
        else:
            print("✗ Erro ao criar usuário")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {e}")

if __name__ == '__main__':
    from datetime import datetime

    print("=" * 50)
    print("TESTE DA API DE USUÁRIOS")
    print("=" * 50)

    test_get_usuarios()
    test_post_usuario()

    print("\n" + "=" * 50)
    print("TESTE FINALIZADO")
    print("=" * 50)

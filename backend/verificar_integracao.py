#!/usr/bin/env python3
"""
Script de verificação da integração entre módulos
Testa se cadastros em Gestão refletem em Capacitação
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def verificar_integracao():
    print("=" * 70)
    print("VERIFICAÇÃO DE INTEGRAÇÃO GESTÃO ↔ CAPACITAÇÃO")
    print("=" * 70)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. Verificar usuários na tabela usuarios
    print("\n1. USUÁRIOS CADASTRADOS (tabela usuarios)")
    print("-" * 70)
    cursor.execute("""
        SELECT id, nome_completo, cargo, status
        FROM usuarios
        ORDER BY created_at DESC
        LIMIT 10
    """)
    usuarios = cursor.fetchall()

    if usuarios:
        for u in usuarios:
            print(f"  • ID: {u['id']} | {u['nome_completo']} | Cargo: {u['cargo']} | Status: {u['status']}")
    else:
        print("  Nenhum usuário cadastrado")

    # 2. Verificar enfermeiras alunas
    print("\n2. ENFERMEIRAS ALUNAS (tabela enfermeiras_alunas)")
    print("-" * 70)
    cursor.execute("SELECT id, nome, cpf FROM enfermeiras_alunas")
    alunas = cursor.fetchall()

    if alunas:
        for a in alunas:
            print(f"  • ID: {a['id']} | {a['nome']} | CPF: {a['cpf']}")
    else:
        print("  Nenhuma aluna cadastrada")

    # 3. Verificar enfermeiras instrutoras
    print("\n3. ENFERMEIRAS INSTRUTORAS (tabela enfermeiras_instrutoras)")
    print("-" * 70)
    cursor.execute("SELECT id, nome, cpf FROM enfermeiras_instrutoras")
    instrutoras = cursor.fetchall()

    if instrutoras:
        for i in instrutoras:
            print(f"  • ID: {i['id']} | {i['nome']} | CPF: {i['cpf']}")
    else:
        print("  Nenhuma instrutora cadastrada")

    # 4. Verificar sincronização
    print("\n4. VERIFICAÇÃO DE SINCRONIZAÇÃO")
    print("-" * 70)

    # Contar Enfermeiros Alunos em usuarios
    cursor.execute("SELECT COUNT(*) as total FROM usuarios WHERE cargo = 'Enfermeiro(a) Aluno(a)'")
    total_alunos_usuarios = cursor.fetchone()['total']

    # Contar registros em enfermeiras_alunas
    cursor.execute("SELECT COUNT(*) as total FROM enfermeiras_alunas")
    total_alunos_capacitacao = cursor.fetchone()['total']

    # Contar Enfermeiros Instrutores em usuarios
    cursor.execute("SELECT COUNT(*) as total FROM usuarios WHERE cargo = 'Enfermeiro(a) Instrutor(a)'")
    total_instrutores_usuarios = cursor.fetchone()['total']

    # Contar registros em enfermeiras_instrutoras
    cursor.execute("SELECT COUNT(*) as total FROM enfermeiras_instrutoras")
    total_instrutores_capacitacao = cursor.fetchone()['total']

    print(f"\n  Enfermeiros(as) Alunos(as):")
    print(f"    - Na tabela 'usuarios': {total_alunos_usuarios}")
    print(f"    - Na tabela 'enfermeiras_alunas': {total_alunos_capacitacao}")

    if total_alunos_usuarios > total_alunos_capacitacao:
        print(f"    ⚠️  ATENÇÃO: {total_alunos_usuarios - total_alunos_capacitacao} aluno(s) não sincronizado(s)!")
    elif total_alunos_usuarios == total_alunos_capacitacao:
        print(f"    ✓ Sincronização OK")

    print(f"\n  Enfermeiros(as) Instrutores(as):")
    print(f"    - Na tabela 'usuarios': {total_instrutores_usuarios}")
    print(f"    - Na tabela 'enfermeiras_instrutoras': {total_instrutores_capacitacao}")

    if total_instrutores_usuarios > total_instrutores_capacitacao:
        print(f"    ⚠️  ATENÇÃO: {total_instrutores_usuarios - total_instrutores_capacitacao} instrutor(es) não sincronizado(s)!")
    elif total_instrutores_usuarios == total_instrutores_capacitacao:
        print(f"    ✓ Sincronização OK")

    # 5. Estatísticas gerais
    print("\n5. ESTATÍSTICAS GERAIS")
    print("-" * 70)

    cursor.execute("SELECT COUNT(*) as total FROM usuarios WHERE status = 'ativo'")
    total_usuarios_ativos = cursor.fetchone()['total']

    cursor.execute("SELECT cargo, COUNT(*) as total FROM usuarios WHERE status = 'ativo' GROUP BY cargo")
    usuarios_por_cargo = cursor.fetchall()

    print(f"\n  Total de usuários ativos: {total_usuarios_ativos}")
    print(f"\n  Distribuição por cargo:")
    for uc in usuarios_por_cargo:
        print(f"    - {uc['cargo']}: {uc['total']}")

    conn.close()

    print("\n" + "=" * 70)
    print("VERIFICAÇÃO CONCLUÍDA")
    print("=" * 70)

if __name__ == '__main__':
    verificar_integracao()

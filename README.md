## Mini Console do Vendedor (React + Tailwind)

## Objetivo: Construir um console leve para triar leads e convertê-los em oportunidades. Você pode usar um

## copiloto de IA; incentivamos os desenvolvedores a fazê-lo, mas estamos avaliando a estrutura e a qualidade.

## Requisitos (MVP)

## 1. Lista de Leads

○ Carregar de um arquivo JSON local. ✅
○ Campos: ID, nome, empresa, e-mail, fonte, pontuação, status. ✅
○ Recursos: pesquisar (nome/empresa), filtrar (status), classificar (descrição da pontuação).✅

## 2. Painel de Detalhes do Lead

○ Clique em uma linha para abrir um painel deslizante.✅
○ Editar status e e-mail em linha (validar formato de e-mail).✅
○ Salvar/cancelar ações com tratamento básico de erros. ✅

## 3. Converter para Oportunidade

○ Botão: Converter Lead.✅
○ Crie uma Oportunidade com: id, nome, etapa, valor (opcional), accountName.✅
○ Exiba as Oportunidades em uma tabela simples.✅

## 4. UX/Estados

○ Estados de carregamento, vazio e erro simples.
○ Lide com cerca de 100 leads sem problemas. ✅ \*\*\*

## Pontos positivos (escolha 1–2)

● Filtro/classificação persistente no localStorage.✅
● Atualizações otimistas com rollback em caso de falha simulada.
● Layout responsivo (desktop → mobile).

## Restrições técnicas

● React (Vite ou CRA) + Tailwind CSS.
● Não requer backend; use JSON local e setTimeout para simular latência.

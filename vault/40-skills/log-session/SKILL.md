---
name: log-session
description: Regista no log do projeto o que foi feito numa sessão e o que fica pendente. Usar no fim de cada sessão de trabalho num projeto.
---

# Registar sessão

1. Abre (ou cria) `10-projects/<projeto>/log/AAAA-MM.md`.
2. Acrescenta no topo uma entrada no formato definido em `log/INDEX.md`: o que foi feito, o que ficou por fazer, ficheiros tocados.
3. Mantém-na curta (5–10 linhas). Decisões importantes não ficam no log: cria uma proposta de ADR em `decisions/` via [[40-skills/propose-change/SKILL]] e liga-a aqui.
4. Atualiza "Estado atual" e "Próximas ações" no `INDEX.md` do projeto, se mudaram.

## Verificação
- A entrada nova está no topo do log do mês e tem data, agente, o que foi feito e o que fica pendente.

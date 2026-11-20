# Настройка ноутбука (для программистов 2 и 3)

Сделать **до поездки** и проверить, что всё запускается.
Людям 4 и 5 (продукт, тесты) достаточно аккаунта на GitHub — чтобы заводить и читать задачи (Issues).

## 1. Программы
| Что | Как проверить | Где взять |
|---|---|---|
| Git | `git --version` | https://git-scm.com |
| Node.js 24 LTS | `node -v` → v24.x | https://nodejs.org |
| GitHub CLI | `gh --version` | `winget install GitHub.cli` |
| Claude Code | `claude --version` | уже есть |
| VS Code (по желанию) | — | `winget install Microsoft.VisualStudioCode` |

После установки **закрыть и заново открыть терминал**, иначе новые команды не найдутся.

## 2. Аккаунты и вход
```bash
git config --global user.name "Имя Фамилия"
git config --global user.email "почта@пример.pl"
gh auth login        # GitHub.com → HTTPS → Login with a web browser
```
Сообщить Владу свой **логин на GitHub** — он добавит тебя в репозиторий. Принять приглашение
(придёт на почту или: `gh api user/repository_invitations`).

## 3. Проект
```bash
gh repo clone <владелец>/<репозиторий>
cd <репозиторий>
npm install
copy .env.example .env.local     # в Git Bash: cp .env.example .env.local
npm run dev                      # открыть http://localhost:3000
```
В `.env.local` вписать **свои** бесплатные ключи (Groq: https://console.groq.com/keys,
Gemini: https://aistudio.google.com/apikey). Ключи никому не пересылать и не коммитить.

Проверка: на главной странице блок «Status AI» → «Testuj połączenie» → зелёные галочки.

## 4. Claude Code
Запускать Claude Code **в папке проекта** — он сам прочитает `CLAUDE.md` с правилами команды.
Первое сообщение своему Claude в начале работы:
> Прочитай CLAUDE.md и docs/WORKFLOW.md. Я программист 2 (или 3), делаю фичи … в папках … Остальное не трогай.

## 5. Что взять с собой
Ноутбук, зарядка, удлинитель, наушники, переходник USB→LAN (если нет порта RJ45),
телефон с мобильным интернетом (раздача), спальник, если остаёмся на ночь.

with open('game.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f'Total lines: {len(lines)}')
with open('game.js', 'w', encoding='utf-8') as f:
    f.writelines(lines[:1724])
print('Done. Truncated to 1724 lines.')

# NoirQR - СТАНДАРТЫ КОДИРОВАНИЯ

## ✅ ЕДИНАЯ СИСТЕМА СТИЛЕЙ

### Используй ТОЛЬКО:
- **CSS-in-JS** через `src/styles.js` ✅
- **Inline styles** с переменными цветов ✅
- **CSS переменные** в `index.css` для глобальных стилей ✅

### НИКОГДА не используй:
- ❌ `@apply` с Tailwind классами в компонентах
- ❌ Несуществующие Tailwind классы типа `placeholder-noir-400`
- ❌ `focus:ring-purple-500` (purple не в конфиге)
- ❌ Смешивание inline styles, Tailwind и CSS modules

---

## 📋ПЕР СТРУКТУРА КОМПОНЕНТА

```jsx
import React, { useState } from 'react';
import { card, button, input, colors, label } from '../styles';

const MyComponent = () => {
  const [data, setData] = useState('');

  return (
    <div style={card}>
      <label style={label}>Название</label>
      <input 
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
        style={input}
        placeholder="Введите текст"
      />
      <button style={buttonPrimary}>Отправить</button>
    </div>
  );
};

export default MyComponent;
```

---

## 🎨ЦИ СИСТЕМА

### Основные цвета:
- **Фон:** `colors.bg.primary` (#0a0a0a)
- **Акцент:** `colors.accent.purple`, `cyan`, `pink`
- **Текст:** `colors.text.primary`, `secondary`, `muted`

### Пример использования:
```jsx
<div style={{ color: colors.text.primary, backgroundColor: colors.bg.secondary }}>
  Content
</div>
```

---

## 🚫ЧАСТЫЕ ОШИБКИ И ИСПРАВЛЕНИЯ

### ❌ ОШИБКА 1: @apply с неправильными классами
```css
/* НЕПРАВИЛЬНО */
.input-modern {
  @apply glass px-4 py-3 rounded-xl placeholder-noir-400;
}
```

### ✅ ИСПРАВЛЕНИЕ
```jsx
style={input}  /* Используй объект из styles.js */
```

---

### ❌ ОШИБКА 2: Несуществующие Tailwind классы
```jsx
/* НЕПРАВИЛЬНО */
className="focus:ring-purple-500 ring-offset-2"
```

### ✅ ИСПРАВЛЕНИЕ
```jsx
style={{
  ...input,
  borderColor: colors.accent.purple,
  boxShadow: `0 0 0 3px rgba(139, 92, 246, 0.1)`
}}
```

---

### ❌ ОШИБКА 3: Миксование стилей
```jsx
/* НЕПРАВИЛЬНО */
<input 
  className="px-4 py-3 rounded-lg"  // Tailwind
  style={{ padding: '10px' }}        // Inline
/>
```

### ✅ ИСПРАВЛЕНИЕ
```jsx
<input style={input} />  /* Только CSS-in-JS */
```

---

## 📝 ПРАВИЛА ИМЕНОВАНИЯ

### Переменные стилей:
- `padding`, `margin`, `gap` - используй rem единицы
- `colors` - всегда через `colors.xxx`
- `transitions` - стандартно `0.3s ease`
- `shadows` - используй `colors.shadow.xx`

### Примеры:
```jsx
const myStyle = {
  padding: '1.5rem',      // ✅ Правильно
  margin: '2em',          // ❌ Неправильно (используй rem)
  color: colors.text.primary,  // ✅ Правильно
  color: '#ffffff',       // ❌ Неправильно (используй переменные)
  transition: 'all 0.3s ease',  // ✅ Правильно
};
```

---

## 🔒ПРО ПРОВЕРКА

Перед commit проверь:
1. ✅ Нет `@apply` директив в компонентах
2. ✅ Нет Tailwind классов типа `placeholder-*`, `focus:ring-*`
3. ✅ Все цвета из `colors` объекта
4. ✅ Все стили используют `styles.js`
5. ✅ Нет смешивания inline + className + CSS modules

---

## 📚ПРИМЕРЫ КОМПОНЕНТОВ

### Пример 1: Простая форма
```jsx
import { card, input, button, label, formGroup } from '../styles';

export default function Form() {
  const [name, setName] = useState('');

  return (
    <div style={card}>
      <div style={formGroup}>
        <label style={label}>Имя</label>
        <input 
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button style={button}>Отправить</button>
    </div>
  );
}
```

### Пример 2: Сетка элементов
```jsx
import { grid, cardHover } from '../styles';

export default function Grid() {
  return (
    <div style={grid}>
      {items.map(item => (
        <div key={item.id} style={cardHover}>
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯СТАНДАРТ УСПЕШНО ВНЕДРЕН

✅ Единая система цветов
✅ Единая система компонентов
✅ Никаких нарушений @apply
✅ Никаких несуществующих классов
✅ Чистый, предсказуемый код

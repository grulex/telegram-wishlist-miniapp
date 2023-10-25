import { dictionary, locale, _, init } from 'svelte-i18n';

let isLoading = false;

init({
    fallbackLocale: 'en',
    initialLocale: 'en',
});

const translates = {
    loading: {
        en: "Loading",
        ru: "Загрузка",
    },
    wishes: {
        en: "Wishes",
        ru: "Желания",
    },
    edit_link: {
        en: "Edit",
        ru: "Изм.",
    },
    copy_link: {
        en: "Copy link",
        ru: "Копировать ссылку",
    },
    link_copied: {
        en: "Link copied to clipboard!",
        ru: "Ссылка скопирована!",
    },
    share: {
        en: "Share",
        ru: "Поделиться",
    },
    booked_by_you: {
        en: "Booked by you",
        ru: "Забронировано вами",
    },
    booked: {
        en: "Booked",
        ru: "Забронировано",
    },
    you_didnt_add_wishes: {
        en: "You don't have wishes yet",
        ru: "Вы пока не добавили желаний",
    },
    didnt_add_wishes: {
        en: "There are no wishes in this wishlist yet",
        ru: "В этом списке пока нет желаний",
    },
    create_first_wish: {
        en: "Create the First Wish",
        ru: "Добавить первое желание",
    },
    go_my_list: {
        en: "Go to My Wishlist",
        ru: "Перейти в мой Вишлист",
    },
    create_your_list: {
        en: "Create your Wishlist!",
        ru: "Создайте свой Вишлист!",
    },
    edit: {
        en: "Edit",
        ru: "Редактировать",
    },
    title: {
        en: "Title",
        ru: "Название",
    },
    description: {
        en: "Description",
        ru: "Описание",
    },
    add_wish: {
        en: "Add Wish",
        ru: "Добавление желания",
    },
    remove: {
        en: "Remove",
        ru: "Удалить",
    },
    removing: {
        en: "Removing",
        ru: "Удаление",
    },
    removing_question: {
        en: "Are you sure you want to remove this wish?",
        ru: "Вы уверены, что хотите удалить это желание?",
    },
    book: {
        en: "Book",
        ru: "Бронировать",
    },
    booking: {
        en: "Booking",
        ru: "Бронирование",
    },
    booking_question: {
        en: "Are you sure you want to book this wish?",
        ru: "Вы уверены, что хотите забронировать это желание?",
    },
    unbook: {
        en: "Unbook!",
        ru: "Отменить бронирование!",
    },
    unbooking: {
        en: "Unbooking",
        ru: "Отмена бронирования",
    },
    unbooking_question: {
        en: "Are you sure you want to unbook this wish?",
        ru: "Вы уверены, что хотите отменить бронирование этого желания?",
    },
    copy_wish: {
        en: "Copy Wish",
        ru: "Копировать Желание",
    },
    wish_copied: {
        en: "Wish copied to you List!",
        ru: "Желание скопировано в ваш Вишлист!",
    },
    open_wish_link: {
        en: "Go to Wish Link",
        ru: "Открыть ссылку на желание",
    },
    save: {
        en: "Save",
        ru: "Сохранить",
    },
    booking_available: {
        en: "Booking is available",
        ru: "Можно забронировать",
    }
}

let dict = {
    en: {
        app: {
            loading: "Loading",
        }
    },
    ru: {
        app: {
            loading: "Загрузка",
        }
    },
};
dictionary.set(dict);

function setupI18n({ withLocale: _locale } = { withLocale: 'en' }) {
    isLoading = true;

    if (!dict[_locale]) {
        _locale = 'en';
    }
    for (let key in translates){
        let value = translates[key];
        let translate = value[_locale];
        if (!translate) {
            console.warn(`No translation for ${key} in ${_locale}`);
        }
        dict[_locale].app[key] = translate;
    }
    dictionary.set(dict);
    locale.set(_locale);
    isLoading = false;
}

export { _, setupI18n, isLoading };

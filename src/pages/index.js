import "../pages/index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "865c665b-e0d4-4036-a501-0420ce26f937",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatar.src = user.avatar;
  })
  .catch(console.error)
  .finally(() => {
    setButtonText;
  });

//EDIT PROFILE SET---------
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

//NEW POST SET-------------
const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostCardCaptionInput = newPostModal.querySelector("#caption-input");
const newPostCardImageInput = newPostModal.querySelector("#card-image-input");

//DELETE POST SET-------------
const deletePostModal = document.querySelector("#delete-post-modal");
const deletePostForm = deletePostModal.querySelector(".modal__form");
const deletePostCancel = deletePostModal.querySelector(
  ".modal__submit-btn_type_cancel",
);
const deletePostClose = deletePostModal.querySelector(
  ".modal__close-btn_type_delete",
);

//PROFILE ELEMENT SET----------
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

//MODAL
const modals = document.querySelectorAll(".modal");

//PREVIEW MODAL SET----------
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

//PREVIEW-ELEMENTS--------
const previewImageEl = previewModal.querySelector(".modal__img");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

//AVATAR FORM SET-----------
const editAvatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-btn");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarInput = editAvatarModal.querySelector("#avatar-name-input");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked === true) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  } else {
    cardLikeBtnEl.classList.remove("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id),
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

editAvatarBtn.addEventListener("click", function () {
  openModal(editAvatarModal);
});

editAvatarCloseBtn.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

deletePostForm.addEventListener("submit", handleDeleteSubmit);

deletePostCancel.addEventListener("click", () => {
  closeModal(deletePostModal);
});

deletePostClose.addEventListener("click", () => {
  closeModal(deletePostModal);
});

function handleBackdropClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const currentModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(currentModal);
    }
  }
}

function handleLike(evt, id) {
  evt.preventDefault();
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .handleLike(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deletePostModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deletePostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

deletePostForm.addEventListener("submit", handleDeleteSubmit);

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo({
      avatar: editAvatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      editAvatarForm.reset();
      disableButton(editAvatarSubmitBtn, settings);
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editAvatarForm.addEventListener("submit", handleAvatarSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .addCard({
      name: newPostCardCaptionInput.value,
      link: newPostCardImageInput.value,
    })
    .then((data) => {
      cardsList.prepend(getCardElement(data));
      console.log(data);
      newPostForm.reset();
      disableButton(newPostSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

newPostModal.addEventListener("submit", handleNewPostSubmit);

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);

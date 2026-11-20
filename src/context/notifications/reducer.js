export const reducer = (state, { type, payload }) => {
     switch (type) {
          case "GET_sucsess":
               return { ...state, payload: "Ma'lumotlar muvoffaqiyatli yetib keldi!" }
          case "POST_sucsess":
               return { ...state, payload: "Ma'lumotlar muvoffaqiyatli saqlandi!" }
          case "DELETE_sucsess":
               return { ...state, payload: "Ma'lumotlar muvoffaqiyatli o'chirildi!" }
          case "EDIT_sucsess":
               return {...state, payload: "Ma'lumotlar muvoffaqiyatli yangilandi!"}
          case "Network_error": {
               return {...state, payload: "Internetga ulanishda muammo!"}
          }
     }
}
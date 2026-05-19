/**
 * @param {boolean} type 
 * @param {string} message 
 */
export function createModal(type, message) {
    const modal = document.createElement("div");



    modal.className = `
        fixed inset-0 bg-black/40 backdrop-blur-sm
        flex items-center justify-center
        z-50
    `;

    modal.innerHTML = `
        <div class="
            bg-white w-full max-w-md
            rounded-3xl p-8
            shadow-2xl
        ">
            <div class="flex flex-col items-center text-center gap-5">

                <div class="
                    w-16 h-16 rounded-full
                    flex items-center justify-center
                    ${type
            ? "bg-emerald-100 text-emerald-600"
            : "bg-rose-100 text-rose-600"}
                ">
                    ${type
            ? `
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        `
            : `
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        `
        }
                </div>

                <div>
                    <h2 class="text-2xl font-black text-slate-900">
                        ${type
            ? "Producto creado"
            : "Error"}
                    </h2>

                    <p class="text-slate-500 mt-2">
                        ${message}
                    </p>
                </div>

                <button
                    id="close-modal"
                    class="
                        cursor-pointer
                        px-6 py-3 rounded-2xl
                        font-bold text-white
                        transition-all
                        ${type
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-rose-600 hover:bg-rose-700"}
                    "
                >
                    Cerrar
                </button>
            </div>
        </div>
    `;

    modal
        .querySelector("#close-modal")
        .addEventListener("click", () => {
            modal.remove();
        });
    document.body.appendChild(modal)
}
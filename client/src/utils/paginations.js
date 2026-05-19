export function updatePaginationButtons($btnNext, $btnBack, currentPage, maxPage) {
    const disabledClasses = [
        "cursor-not-allowed",
        "text-slate-300"
    ];

    const enabledClasses = [
        "cursor-pointer",
        "text-indigo-600",
        "shadow-sm"
    ];

    if (currentPage === 1) {
        $btnBack.classList.remove(...enabledClasses);
        $btnBack.classList.add(...disabledClasses);
    } else {
        $btnBack.classList.remove(...disabledClasses);
        $btnBack.classList.add(...enabledClasses);
    }
    
    if (currentPage === maxPage) {
        $btnNext.classList.remove(...enabledClasses);
        $btnNext.classList.add(...disabledClasses);
    } else {
        $btnNext.classList.remove(...disabledClasses);
        $btnNext.classList.add(...enabledClasses);
    }
}


export function calculateRange(currentPage, limit, total) {
  return {
    start: (currentPage - 1) * limit + 1,
    end: Math.min(currentPage * limit, total)
  };
}
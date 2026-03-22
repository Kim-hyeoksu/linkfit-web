import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Search } from "lucide-react";
import { Food, searchFoodByName } from "@/entities/food";
import { useDebounce, useIntersectionObserver } from "@/shared/utils";

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: (food: Food) => void;
}

const PAGE_SIZE = 20;

export const FoodSearchModal = ({
  isOpen,
  onClose,
  onSelectFood,
}: FoodSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // debounced text
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 검색어 변경 시 초기화 및 첫 페이지 조회
  useEffect(() => {
    const fetchFirstResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setResults([]);
        setPage(0);
        setIsLastPage(false);
        return;
      }

      setIsSearching(true);
      setPage(0);
      try {
        const response = await searchFoodByName(debouncedSearchTerm, 0, PAGE_SIZE);
        setResults(response.content || []);
        setIsLastPage(response.last ?? true);
      } catch (error) {
        console.error("Failed to search food:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchFirstResults();
  }, [debouncedSearchTerm]);

  // 스크롤 시 다음 페이지 로드
  const loadMore = useCallback(async () => {
    if (isSearching || isFetchingMore || isLastPage || !debouncedSearchTerm.trim()) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    try {
      const response = await searchFoodByName(debouncedSearchTerm, nextPage, PAGE_SIZE);
      setResults((prev) => [...prev, ...(response.content || [])]);
      setPage(nextPage);
      setIsLastPage(response.last ?? true);
    } catch (error) {
      console.error("Failed to fetch more foods:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [debouncedSearchTerm, isSearching, isFetchingMore, isLastPage, page]);

  // Observer 타겟
  const observerTarget = useIntersectionObserver(loadMore, { threshold: 0.1 });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="어떤 음식을 드셨나요?"
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-[15px] font-bold text-slate-800 focus:ring-2 focus:ring-main/20 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        {isSearching && page === 0 ? (
          <div className="p-8 text-center text-[14px] font-bold text-slate-400">
            검색 중...
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col">
            {results.map((food, idx) => (
              <button
                key={`${food.id}-${idx}`}
                onClick={() => onSelectFood(food)}
                className="flex flex-col gap-1.5 px-6 py-4 bg-white border-b border-slate-100 text-left active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[16px] font-bold text-slate-800 break-keep">
                    {food.foodName}
                  </span>
                  {food.makerName && food.makerName !== "해당없음" && (
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md shrink-0">
                      {food.makerName}
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-medium text-slate-500">
                  {food.servingSize > 0 && `${food.servingSize}g당) `}
                  {food.calories}kcal | 탄 {food.carbohydrate}g · 단{" "}
                  {food.protein}g · 지 {food.fat}g
                </span>
              </button>
            ))}
            
            {/* Infinite Scroll Trigger */}
            {!isLastPage && (
              <div ref={observerTarget} className="p-8 text-center text-[14px] font-bold text-slate-400">
                {isFetchingMore ? "더 불러오는 중..." : "목록을 불러오는 중..."}
              </div>
            )}
          </div>
        ) : debouncedSearchTerm ? (
          <div className="p-8 text-center flex flex-col items-center gap-3">
            <span className="text-[14px] font-bold text-slate-500">
              검색 결과가 없어요
            </span>
            <button
              onClick={() =>
                onSelectFood({
                  id: -1,
                  foodCode: "direct",
                  foodName: searchTerm,
                  makerName: "직접입력",
                  category: "직접입력",
                  totalWeight: 0,
                  servingSize: 0,
                  calories: 0,
                  carbohydrate: 0,
                  protein: 0,
                  fat: 0,
                  sugars: 0,
                  sodium: 0,
                  transFat: 0,
                })
              }
              className="text-[13px] font-bold px-4 py-2 bg-main text-white rounded-xl active:scale-95 transition-all"
            >
              '{searchTerm}' 직접 입력하기
            </button>
          </div>
        ) : (
          <div className="p-8 text-center text-[14px] font-bold text-slate-400">
            음식 이름을 검색해보세요
          </div>
        )}
      </div>
    </div>
  );
};

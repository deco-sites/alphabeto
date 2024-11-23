import { useEffect } from "preact/hooks";
import { useId } from "site/sdk/useId.ts";
interface MultiRangeSliderProps {
    min: string;
    minVal: string;
    max: string;
    maxVal: string;
    step: string;
    onChange: (min: number, max: number) => void;
}

const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

const removeCurrency = (value: string) => {
    return value.replace("R$", "").replace(" ", "").replace(",", ".");
};
const matchValue = (value: string) => {
    return value.match(/R\$\s?(\d{1,3}\.)*\d{1,3},\d{2}/);
};
// deno-lint-ignore ban-types
const debounce = (func: Function, wait: number, immediate: boolean) => {
    let timeout: number;
    return function (this: unknown) {
        // deno-lint-ignore no-this-alias
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = 0;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
function dRange(
    range: HTMLSpanElement,
    ri: NodeListOf<HTMLInputElement>,
    ti: NodeListOf<HTMLInputElement>,
    step: string,
    update: (min: number, max: number) => void,
) {
    ri.forEach((z) => {
        z.addEventListener("input", () => {
            ti[0].value = formatBRL(parseFloat(ri[0].value));
            ti[1].value = formatBRL(parseFloat(ri[1].value));
            update_dRange();
        });
        z.addEventListener(
            "change",
            debounce(
                () => {
                    update(
                        parseFloat(removeCurrency(ti[0].value)),
                        parseFloat(removeCurrency(ti[1].value)),
                    );
                },
                500,
                false,
            ),
        );
    });

    ti.forEach((z) => {
        z.addEventListener("input", () => {
            const valueT1 = ti[0].value;
            const valueT2 = ti[1].value;
            const matchs = [matchValue(valueT1), matchValue(valueT2)];
            if (matchs[0] && matchs[1]) {
                const valueW1 = parseFloat(removeCurrency(matchs[0][0]));
                const valueW2 = parseFloat(removeCurrency(matchs[1][0]));
                console.log(valueW1, valueW2);
                ri[0].value = valueW1.toString();
                ri[1].value = valueW2.toString();
                update_dRange();
            }
        });
        z.addEventListener("keydown", (e) => {
            const isEnter = e.key === "Enter";
            const valueT1 = ti[0].value;
            const valueT2 = ti[1].value;
            const matchs = [matchValue(valueT1), matchValue(valueT2)];
            if (matchs[0] && matchs[1] && isEnter) {
                update(
                    parseFloat(removeCurrency(matchs[0][0])),
                    parseFloat(removeCurrency(matchs[1][0])),
                );
            }
        });
        z.addEventListener("change", () => {
            update_dRange(true);
        });
    });

    const update_dRange = (change = false) => {
        const def_min = parseFloat(ri[0].min);
        const def_max = parseFloat(ri[0].max);

        let minval = parseFloat(ri[0].value);
        let maxval = parseFloat(ri[1].value);

        const stepFloat = parseFloat(step);

        const step_per_percentage = 100 / (def_max - def_min);

        if (def_min >= minval) {
            minval = def_min;
            if (change) {
                ti[0].value = formatBRL(def_min);
                ri[0].value = String(def_min);
            }
        }
        if (maxval <= def_min) {
            maxval = def_min + parseFloat(step);
            if (change) {
                ti[1].value = formatBRL(def_min);
                ri[1].value = String(maxval);
            }
        }

        if (minval >= maxval) {
            minval = maxval - stepFloat;
            ri[0].value = String(minval);
            ti[0].value = formatBRL(minval);
        }

        if (maxval <= minval) {
            maxval = minval + stepFloat;
            ri[1].value = String(maxval);
            ti[1].value = formatBRL(maxval);
        }

        range.style.left = (minval - def_min) * step_per_percentage + "%";
        range.style.right = 100 - (maxval - def_min) * step_per_percentage +
            "%";
    };
    update_dRange(true);
}

function startMultiRangeSlider(
    id: string,
    step: string,
    update: (min: number, max: number) => void,
) {
    const container = document.getElementById(id);
    if (!container) return;
    const range = container.querySelector(
        ".double-range .range-fill",
    ) as HTMLSpanElement;
    const range_input = container.querySelectorAll(
        ".double-range .range-input input",
    ) as NodeListOf<HTMLInputElement>;
    const text_input = container.querySelectorAll(
        ".double-range .text-input input",
    ) as NodeListOf<HTMLInputElement>;
    dRange(range, range_input, text_input, step, update);
}

export default function MultiRangeSlider(props: MultiRangeSliderProps) {
    const id = useId();
    const { min, max, step, maxVal, minVal, onChange } = props;

    useEffect(() => {
        startMultiRangeSlider(id, step, onChange);
    }, []);

    return (
        <div id={id}>
            <div class="double-range">
                <div class="range-slider">
                    <span class="range-fill"></span>
                </div>
                <div class="range-input">
                    <input
                        type="range"
                        class="min"
                        min={min}
                        max={max}
                        value={minVal}
                        step={step}
                    />
                    <input
                        type="range"
                        class="max"
                        min={min}
                        max={max}
                        value={maxVal}
                        step={step}
                    />
                </div>
                <div class="flex justify-between text-[#676767] text-xs leading-[18px] my-4">
                    <span>{formatBRL(parseFloat(min))}</span>
                    <span>{formatBRL(parseFloat(max))}</span>
                </div>
                <div class="text-input flex gap-3">
                    <div class="flex flex-col">
                        <label
                            for="min"
                            class="text-[#676767] text-xs leading-[18px] font-bold mb-0.5"
                        >
                            Mínimo
                        </label>
                        <input
                            id="min"
                            class="bg-[#F5F4F1] rounded outline-none max-w-[106.5px] text-[#676767] text-xs leading-[18px] h-9 flex items-center pl-3 before:content-['R$']"
                            name="min"
                            value={formatBRL(parseFloat(minVal))}
                        />
                    </div>
                    <div class="flex flex-col items-end">
                        <label
                            for="max"
                            class="text-[#676767] text-xs leading-[18px] font-bold mb-0.5"
                        >
                            Máximo
                        </label>
                        <input
                            id="max"
                            class="bg-[#F5F4F1] rounded outline-none max-w-[106.5px] text-[#676767] text-xs leading-[18px] h-9 flex items-center pl-3 before:content-['R$']"
                            name="max"
                            value={formatBRL(parseFloat(maxVal))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

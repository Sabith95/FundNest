// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import Header from "../../../../components/Header";
// import Sidebar from "../../../../components/Sidebar";
// import {
//   tenantKycConfigService,
//   type IKycFieldView,
//   type IKycTemplateView,
// } from "../../../../services/tenantKycConfigureService";

// // ─── Types ────────────────────────────────────────────────
// type IKycField = IKycFieldView;
// type SaveStatus = "idle" | "saving" | "saved" | "error";

// // TODO: replace with the authenticated user (auth store / context)
// const CURRENT_USER = { name: "Alex Thompson", role: "Admin" };

// const AUTOSAVE_DELAY_MS = 1200;
// const EMPTY_MESSAGE = "Add at least one field to save";

// const MIME_LABEL: Record<string, string> = {
//   "application/pdf": "PDF",
//   "image/jpeg": "JPG",
//   "image/png": "PNG",
// };
// const formatConstraints = (f: IKycField): string => {
//   const types = (f.allowedMimeTypes ?? ["application/pdf", "image/jpeg", "image/png"])
//     .map((m) => MIME_LABEL[m] ?? m.split("/")[1]?.toUpperCase() ?? m)
//     .join(", ");
//   return `${types} · up to ${f.maxFileSizeMb ?? 5} MB`;
// };

// // ─── Icons ────────────────────────────────────────────────
// const iconProps = {
//   fill: "none",
//   stroke: "currentColor",
//   strokeWidth: 2,
//   strokeLinecap: "round" as const,
//   strokeLinejoin: "round" as const,
//   viewBox: "0 0 24 24",
// };

// const GripIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
//     {[6, 12, 18].map((y) =>
//       [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />)
//     )}
//   </svg>
// );
// const PlusIcon = ({ size = 16 }: { size?: number }) => (
//   <svg width={size} height={size} {...iconProps} aria-hidden>
//     <line x1="12" y1="5" x2="12" y2="19" />
//     <line x1="5" y1="12" x2="19" y2="12" />
//   </svg>
// );
// const TrashIcon = () => (
//   <svg width="15" height="15" {...iconProps} aria-hidden>
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//     <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
//   </svg>
// );
// const ChevronIcon = ({ up }: { up?: boolean }) => (
//   <svg width="14" height="14" {...iconProps} aria-hidden>
//     <polyline points={up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
//   </svg>
// );
// const PaperclipIcon = () => (
//   <svg width="16" height="16" {...iconProps} aria-hidden>
//     <path d="M21.4 11.1l-9.2 9.2a6 6 0 01-8.5-8.5l9.2-9.2a4 4 0 015.7 5.7l-9.2 9.2a2 2 0 01-2.8-2.8l8.5-8.5" />
//   </svg>
// );
// const CheckCircleIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
//     <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.6L6.6 12.4l1.4-1.4 2.8 2.8 5.2-5.2 1.4 1.4-6.6 6.6z" />
//   </svg>
// );
// const ShieldIcon = () => (
//   <svg width="12" height="12" {...iconProps} aria-hidden>
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );

// // ─── Toggle ───────────────────────────────────────────────
// const Toggle = memo(
//   ({
//     checked,
//     onChange,
//     label,
//   }: {
//     checked: boolean;
//     onChange: () => void;
//     label: string;
//   }) => (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       aria-label={label}
//       onClick={onChange}
//       className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
//         checked ? "bg-emerald-800" : "bg-gray-200"
//       }`}
//     >
//       <span
//         className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
//           checked ? "translate-x-5" : "translate-x-0"
//         }`}
//       />
//     </button>
//   )
// );
// Toggle.displayName = "Toggle";

// // ─── Field card ───────────────────────────────────────────
// interface IFieldCardProps {
//   field: IKycField;
//   index: number;
//   total: number;
//   isDragging: boolean;
//   isDragOver: boolean;
//   onToggle: (id: string) => void;
//   onRemove: (id: string) => void;
//   onMove: (index: number, dir: -1 | 1) => void;
//   onDragStart: (index: number) => void;
//   onDragEnter: (index: number) => void;
//   onDragEnd: () => void;
// }

// const iconBtn =
//   "rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent";

// const FieldCard = memo(
//   ({
//     field,
//     index,
//     total,
//     isDragging,
//     isDragOver,
//     onToggle,
//     onRemove,
//     onMove,
//     onDragStart,
//     onDragEnter,
//     onDragEnd,
//   }: IFieldCardProps) => (
//     <li
//       draggable
//       onDragStart={() => onDragStart(index)}
//       onDragEnter={() => onDragEnter(index)}
//       onDragOver={(e) => e.preventDefault()}
//       onDragEnd={onDragEnd}
//       className={`group flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-150 sm:items-center sm:gap-4 sm:p-5 ${
//         isDragging ? "opacity-40" : "opacity-100"
//       } ${isDragOver ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-100"}`}
//     >
//       <span
//         className="mt-1 cursor-grab touch-none text-gray-300 group-hover:text-gray-400 active:cursor-grabbing sm:mt-0"
//         aria-hidden
//       >
//         <GripIcon />
//       </span>

//       <div className="min-w-0 flex-1">
//         <div className="flex flex-wrap items-center gap-2">
//           <h3 className="break-words text-base font-semibold text-gray-900">
//             {field.label}
//           </h3>
//           <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
//             File upload
//           </span>
//           {field.requiresBothSides && (
//             <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
//               Front &amp; back
//             </span>
//           )}
//         </div>
//         <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
//           {field.description}
//         </p>
//       </div>

//       <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
//         <div className="flex items-center">
//           <button
//             type="button"
//             onClick={() => onMove(index, -1)}
//             disabled={index === 0}
//             aria-label={`Move ${field.label} up`}
//             className={iconBtn}
//           >
//             <ChevronIcon up />
//           </button>
//           <button
//             type="button"
//             onClick={() => onMove(index, 1)}
//             disabled={index === total - 1}
//             aria-label={`Move ${field.label} down`}
//             className={iconBtn}
//           >
//             <ChevronIcon />
//           </button>
//           <button
//             type="button"
//             onClick={() => onRemove(field.id)}
//             aria-label={`Remove ${field.label}`}
//             className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
//           >
//             <TrashIcon />
//           </button>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
//             Required
//           </span>
//           <Toggle
//             checked={field.required}
//             onChange={() => onToggle(field.id)}
//             label={`${field.label} required`}
//           />
//         </div>
//       </div>
//     </li>
//   )
// );
// FieldCard.displayName = "FieldCard";

// // ─── Add-field form ───────────────────────────────────────
// type NewField = Pick<IKycField, "label" | "description" | "requiresBothSides">;

// interface IAddFieldProps {
//   open: boolean;
//   onOpen: () => void;
//   onCancel: () => void;
//   onAdd: (data: NewField) => void;
// }

// const AddFieldPanel = memo(({ open, onOpen, onCancel, onAdd }: IAddFieldProps) => {
//   const [label, setLabel] = useState("");
//   const [description, setDescription] = useState("");
//   const [bothSides, setBothSides] = useState(false);
//   const labelRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (open) labelRef.current?.focus();
//   }, [open]);

//   const reset = () => {
//     setLabel("");
//     setDescription("");
//     setBothSides(false);
//   };

//   const submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!label.trim()) return;
//     onAdd({
//       label: label.trim(),
//       description: description.trim(),
//       requiresBothSides: bothSides,
//     });
//     reset();
//   };

//   const inputCls =
//     "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

//   if (!open) {
//     return (
//       <button
//         type="button"
//         onClick={onOpen}
//         className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 px-4 py-10 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
//       >
//         <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
//           <PlusIcon size={20} />
//         </span>
//         <span className="text-base font-bold text-gray-900">
//           Add another verification field
//         </span>
//         <span className="text-xs text-gray-500 sm:text-sm">
//           Drag and drop components to reorganize
//         </span>
//       </button>
//     );
//   }

//   return (
//     <form
//       onSubmit={submit}
//       className="space-y-3 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm sm:p-5"
//     >
//       <h3 className="text-base font-semibold text-gray-900">New document</h3>
//       <div>
//         <label htmlFor="kyc-label" className="mb-1 block text-xs font-semibold text-gray-600">
//           Document name
//         </label>
//         <input
//           id="kyc-label"
//           ref={labelRef}
//           className={inputCls}
//           value={label}
//           onChange={(e) => setLabel(e.target.value)}
//           placeholder="e.g. Passport"
//           maxLength={60}
//         />
//       </div>
//       <div>
//         <label htmlFor="kyc-desc" className="mb-1 block text-xs font-semibold text-gray-600">
//           Help text
//         </label>
//         <input
//           id="kyc-desc"
//           className={inputCls}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="What should the user upload?"
//           maxLength={120}
//         />
//       </div>
//       <label className="flex items-center gap-2 text-sm text-gray-700">
//         <input
//           type="checkbox"
//           checked={bothSides}
//           onChange={(e) => setBothSides(e.target.checked)}
//           className="h-4 w-4 rounded border-gray-300 text-indigo-700 focus:ring-indigo-400"
//         />
//         Requires front and back sides
//       </label>
//       <div className="flex justify-end gap-2 pt-1">
//         <button
//           type="button"
//           onClick={() => {
//             reset();
//             onCancel();
//           }}
//           className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={!label.trim()}
//           className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           Add field
//         </button>
//       </div>
//     </form>
//   );
// });
// AddFieldPanel.displayName = "AddFieldPanel";

// // ─── Live preview ─────────────────────────────────────────
// const PreviewField = memo(({ field }: { field: IKycField }) => (
//   <div>
//     <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-700">
//       {field.label}
//       {field.required && <span className="ml-0.5 text-red-500">*</span>}
//     </label>
//     <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm italic text-gray-400">
//       {field.requiresBothSides ? "Select front and back…" : "Select file…"}
//       <PaperclipIcon />
//     </div>
//     <p className="mt-1.5 text-[11px] text-gray-500">{formatConstraints(field)}</p>
//   </div>
// ));
// PreviewField.displayName = "PreviewField";

// const KycPreview = memo(({ fields }: { fields: IKycField[] }) => (
//   <section
//     aria-label="User KYC preview"
//     className="flex flex-col rounded-3xl bg-gray-100/80 p-5 sm:p-6 lg:min-h-[calc(100vh-8rem)]"
//   >
//     <div className="mb-6 flex items-center justify-between">
//       <h2 className="text-sm font-semibold text-gray-900">User KYC Preview</h2>
//       <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
//         Live view
//       </span>
//     </div>

//     <div className="flex flex-1 flex-col gap-5">
//       {fields.length === 0 ? (
//         <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
//           Add a field to see how users will verify their identity.
//         </p>
//       ) : (
//         <>
//           {fields.map((f) => (
//             <PreviewField key={f.id} field={f} />
//           ))}
//           <button
//             type="button"
//             disabled
//             className="mt-2 w-full rounded-xl bg-indigo-800 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 disabled:cursor-default"
//           >
//             Submit for Verification
//           </button>
//         </>
//       )}
//     </div>

//     <p className="mt-8 flex items-center justify-center gap-1.5 border-t border-gray-200 pt-4 text-[11px] text-gray-500">
//       <ShieldIcon />
//       Secured by FundNest Vault
//     </p>
//   </section>
// ));
// KycPreview.displayName = "KycPreview";

// // ─── Autosave indicator ───────────────────────────────────
// const SaveIndicator = ({
//   status,
//   error,
// }: {
//   status: SaveStatus;
//   error: string | null;
// }) => {
//   const map: Record<SaveStatus, { text: string; cls: string }> = {
//     idle: { text: "No changes", cls: "text-gray-400" },
//     saving: { text: "Saving…", cls: "text-gray-500" },
//     saved: { text: "Autosaved", cls: "text-emerald-800" },
//     error: { text: error ?? "Save failed. Try again.", cls: "text-red-600" },
//   };
//   const { text, cls } = map[status];
//   return (
//     <span
//       role="status"
//       aria-live="polite"
//       className={`flex items-center gap-1.5 text-xs font-medium ${cls}`}
//     >
//       {status === "saved" && <CheckCircleIcon />}
//       {text}
//     </span>
//   );
// };

// // ─── Editor (runs once the template is loaded) ────────────
// const KycEditor: React.FC<{ template: IKycTemplateView }> = ({ template }) => {
//   const [fields, setFields] = useState<IKycField[]>(template.fields);
//   const [isActive, setIsActive] = useState<boolean>(template.isActive);
//   const [adding, setAdding] = useState(false);
//   const [status, setStatus] = useState<SaveStatus>("idle");
//   const [error, setError] = useState<string | null>(null);
//   const [dragIndex, setDragIndex] = useState<number | null>(null);
//   const [overIndex, setOverIndex] = useState<number | null>(null);
//   const [mobileTab, setMobileTab] = useState<"config" | "preview">("config");

//   const dirty = useRef(false);
//   const fieldsRef = useRef(fields);
//   const activeRef = useRef(isActive);
//   fieldsRef.current = fields;
//   activeRef.current = isActive;

//   const persist = useCallback(async () => {
//     const current = fieldsRef.current;
//     if (current.length === 0) {
//       setError(EMPTY_MESSAGE);
//       setStatus("error");
//       return;
//     }
//     setStatus("saving");
//     setError(null);
//     try {
//       await tenantKycConfigService.saveTemplate(
//         {
//           name: template.name,
//           description: template.description,
//           isActive: activeRef.current,
//         },
//         current
//       );
//       // If the user kept editing while the request ran, a new autosave is queued.
//       if (fieldsRef.current === current) dirty.current = false;
//       setStatus("saved");
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed. Try again.");
//       setStatus("error");
//     }
//   }, [template.name, template.description]);

//   // Debounced autosave; skipped until the user actually edits something
//   useEffect(() => {
//     if (!dirty.current) return;
//     if (fields.length === 0) {
//       setError(EMPTY_MESSAGE);
//       setStatus("error");
//       return;
//     }
//     setStatus("saving");
//     const t = window.setTimeout(persist, AUTOSAVE_DELAY_MS);
//     return () => window.clearTimeout(t);
//   }, [fields, isActive, persist]);

//   // Warn before leaving with unsaved edits
//   useEffect(() => {
//     const onBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (dirty.current) e.preventDefault();
//     };
//     window.addEventListener("beforeunload", onBeforeUnload);
//     return () => window.removeEventListener("beforeunload", onBeforeUnload);
//   }, []);

//   const update = useCallback((updater: (prev: IKycField[]) => IKycField[]) => {
//     dirty.current = true;
//     setFields(updater);
//   }, []);

//   const handleToggle = useCallback(
//     (id: string) =>
//       update((prev) =>
//         prev.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
//       ),
//     [update]
//   );

//   const handleRemove = useCallback(
//     (id: string) => update((prev) => prev.filter((f) => f.id !== id)),
//     [update]
//   );

//   const handleMove = useCallback(
//     (index: number, dir: -1 | 1) =>
//       update((prev) => {
//         const target = index + dir;
//         if (target < 0 || target >= prev.length) return prev;
//         const next = [...prev];
//         [next[index], next[target]] = [next[target], next[index]];
//         return next;
//       }),
//     [update]
//   );

//   const handleAdd = useCallback(
//     (data: NewField) => {
//       update((prev) => [
//         ...prev,
//         {
//           ...data,
//           id: crypto.randomUUID(),
//           type: "FILE_UPLOAD",
//           required: false,
//         },
//       ]);
//       setAdding(false);
//     },
//     [update]
//   );

//   const handleActiveToggle = useCallback(() => {
//     dirty.current = true;
//     setIsActive((v) => !v);
//   }, []);

//   const handleDragEnd = useCallback(() => {
//     if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
//       update((prev) => {
//         const next = [...prev];
//         const [moved] = next.splice(dragIndex, 1);
//         next.splice(overIndex, 0, moved);
//         return next;
//       });
//     }
//     setDragIndex(null);
//     setOverIndex(null);
//   }, [dragIndex, overIndex, update]);

//   const requiredCount = useMemo(
//     () => fields.filter((f) => f.required).length,
//     [fields]
//   );

//   return (
//     <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
//       {/* Title + actions */}
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-gray-900">
//             KYC Configuration
//           </h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Define the documents and details required for user verification
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => {
//               setMobileTab("config");
//               setAdding(true);
//             }}
//             className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 transition hover:bg-gray-50"
//           >
//             <PlusIcon size={14} /> Add Field
//           </button>
//           <button
//             type="button"
//             onClick={persist}
//             disabled={status === "saving"}
//             className="rounded-xl bg-indigo-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:bg-indigo-900 disabled:opacity-60"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>

//       {/* Mobile / tablet tab switch */}
//       <div
//         role="tablist"
//         className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-gray-200/70 p-1 lg:hidden"
//       >
//         {(["config", "preview"] as const).map((tab) => (
//           <button
//             key={tab}
//             role="tab"
//             aria-selected={mobileTab === tab}
//             onClick={() => setMobileTab(tab)}
//             className={`rounded-lg py-2 text-sm font-semibold transition ${
//               mobileTab === tab
//                 ? "bg-white text-indigo-800 shadow-sm"
//                 : "text-gray-500"
//             }`}
//           >
//             {tab === "config" ? "Configure" : "Preview"}
//           </button>
//         ))}
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:gap-8">
//         {/* Configuration canvas */}
//         <section
//           aria-label="Configuration canvas"
//           className={mobileTab === "config" ? "block" : "hidden lg:block"}
//         >
//           <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
//             <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
//               Configuration canvas
//               <span className="ml-2 normal-case tracking-normal text-gray-400">
//                 {requiredCount} of {fields.length} required
//               </span>
//             </h2>
//             <SaveIndicator status={status} error={error} />
//           </div>

//           <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
//             <div className="min-w-0">
//               <p className="text-sm font-semibold text-gray-900">
//                 Require KYC for investors
//               </p>
//               <p className="text-xs text-gray-500">
//                 {isActive
//                   ? "Users must complete these documents before joining a fund."
//                   : "KYC is off. Users can join funds without verification."}
//               </p>
//             </div>
//             <Toggle
//               checked={isActive}
//               onChange={handleActiveToggle}
//               label="Require KYC for investors"
//             />
//           </div>

//           <ul className="flex flex-col gap-3">
//             {fields.map((f, i) => (
//               <FieldCard
//                 key={f.id}
//                 field={f}
//                 index={i}
//                 total={fields.length}
//                 isDragging={dragIndex === i}
//                 isDragOver={overIndex === i && dragIndex !== i}
//                 onToggle={handleToggle}
//                 onRemove={handleRemove}
//                 onMove={handleMove}
//                 onDragStart={setDragIndex}
//                 onDragEnter={setOverIndex}
//                 onDragEnd={handleDragEnd}
//               />
//             ))}
//           </ul>

//           <div className="mt-4">
//             <AddFieldPanel
//               open={adding}
//               onOpen={() => setAdding(true)}
//               onCancel={() => setAdding(false)}
//               onAdd={handleAdd}
//             />
//           </div>
//         </section>

//         {/* Live preview */}
//         <div
//           className={`lg:sticky lg:top-20 lg:self-start ${
//             mobileTab === "preview" ? "block" : "hidden lg:block"
//           }`}
//         >
//           <KycPreview fields={fields} />
//         </div>
//       </div>
//     </main>
//   );
// };

// // ─── Loading / error states ───────────────────────────────
// const PageSkeleton = () => (
//   <main className="flex-1 animate-pulse px-4 py-6 sm:px-6 lg:px-8" aria-busy="true">
//     <div className="mb-8 h-8 w-64 rounded bg-gray-200" />
//     <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
//       <div className="space-y-3">
//         {[0, 1, 2].map((i) => (
//           <div key={i} className="h-24 rounded-2xl bg-gray-200" />
//         ))}
//       </div>
//       <div className="hidden h-96 rounded-3xl bg-gray-200 lg:block" />
//     </div>
//   </main>
// );

// const LoadError: React.FC<{ message: string; onRetry: () => void }> = ({
//   message,
//   onRetry,
// }) => (
//   <main className="flex flex-1 items-center justify-center px-4 py-16">
//     <div className="max-w-sm rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
//       <h1 className="text-base font-semibold text-gray-900">
//         Couldn&apos;t load KYC configuration
//       </h1>
//       <p className="mt-1 text-sm text-gray-500">{message}</p>
//       <button
//         type="button"
//         onClick={onRetry}
//         className="mt-4 rounded-xl bg-indigo-800 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-900"
//       >
//         Try again
//       </button>
//     </div>
//   </main>
// );

// // ─── Page (container) ─────────────────────────────────────
// const KycConfigurationPage: React.FC = () => {
//   const [template, setTemplate] = useState<IKycTemplateView | null>(null);
//   const [loadError, setLoadError] = useState<string | null>(null);
//   const [reloadKey, setReloadKey] = useState(0);

//   useEffect(() => {
//     const controller = new AbortController();
//     setLoadError(null);
//     tenantKycConfigService
//       .getTemplate(controller.signal)
//       .then(setTemplate)
//       .catch((e: unknown) => {
//         if (controller.signal.aborted) return;
//         setLoadError(e instanceof Error ? e.message : "Please try again.");
//       });
//     return () => controller.abort();
//   }, [reloadKey]);

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />
//       <div className="flex min-w-0 flex-1 flex-col">
//         <Header userName={CURRENT_USER.name} userRole={CURRENT_USER.role} />
//         {loadError ? (
//           <LoadError message={loadError} onRetry={() => setReloadKey((k) => k + 1)} />
//         ) : template ? (
//           <KycEditor template={template} />
//         ) : (
//           <PageSkeleton />
//         )}
//       </div>
//     </div>
//   );
// };

// export default KycConfigurationPage;

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Navigate } from "react-router-dom";
import Header from "../../../../components/tenant/Header";
import Sidebar from "../../../../components/tenant/Sidebar";
import { ROUTES } from "../../../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { mapTenantVerificationStatus } from "../../../../utitls/tenantRouting";
import { tenantAuthService } from "../../../../services/tenantAuthService";
import { setTenant } from "../../../../store/slices/tenantSlice";
import type { TenantUser } from "../../../../types/tenant.types";
import {
  KycDocumentType,
  tenantKycConfigService,
  type IKycFieldView,
  type IKycTemplateView,
} from "../../../../services/tenantKycConfigureService";

// ─── Types ────────────────────────────────────────────────

type IKycField = IKycFieldView;
type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 1200;
const EMPTY_MESSAGE = "Add at least one field to save";

const DEFAULT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const DEFAULT_MAX_FILE_MB = 5;

const MIME_LABEL: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

const formatConstraints = (
  f: IKycField
): string => {
  const types = (
    f.allowedMimeTypes?.length
      ? f.allowedMimeTypes
      : DEFAULT_MIME_TYPES
  )
    .map(
      (m) =>
        MIME_LABEL[m] ??
        m.split("/")[1]?.toUpperCase() ??
        m
    )
    .join(", ");

  return `${types} · up to ${
    f.maxFileSizeMb || DEFAULT_MAX_FILE_MB
  } MB`;
};

// ─── Icons ────────────────────────────────────────────────

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const GripIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    {[6, 12, 18].map((y) =>
      [9, 15].map((x) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="1.4"
        />
      ))
    )}
  </svg>
);

const PlusIcon = ({
  size = 16,
}: {
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    {...iconProps}
    aria-hidden
  >
    <line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
    />
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    {...iconProps}
    aria-hidden
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const ChevronIcon = ({
  up,
}: {
  up?: boolean;
}) => (
  <svg
    width="14"
    height="14"
    {...iconProps}
    aria-hidden
  >
    <polyline
      points={
        up
          ? "18 15 12 9 6 15"
          : "6 9 12 15 18 9"
      }
    />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    width="16"
    height="16"
    {...iconProps}
    aria-hidden
  >
    <path d="M21.4 11.1l-9.2 9.2a6 6 0 01-8.5-8.5l9.2-9.2a4 4 0 015.7 5.7l-9.2 9.2a2 2 0 01-2.8-2.8l8.5-8.5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.6L6.6 12.4l1.4-1.4 2.8 2.8 5.2-5.2 1.4 1.4-6.6 6.6z" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="12"
    height="12"
    {...iconProps}
    aria-hidden
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Toggle ───────────────────────────────────────────────

const Toggle = memo(
  ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
        checked
          ? "bg-emerald-800"
          : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked
            ? "translate-x-5"
            : "translate-x-0"
        }`}
      />
    </button>
  )
);

Toggle.displayName = "Toggle";

// ─── Field card ───────────────────────────────────────────

interface IFieldCardProps {
  field: IKycField;
  index: number;
  total: number;
  isDragging: boolean;
  isDragOver: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (
    index: number,
    dir: -1 | 1
  ) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

const iconBtn =
  "rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent";

const FieldCard = memo(
  ({
    field,
    index,
    total,
    isDragging,
    isDragOver,
    onToggle,
    onRemove,
    onMove,
    onDragStart,
    onDragEnter,
    onDragEnd,
  }: IFieldCardProps) => (
    <li
      draggable
      onDragStart={() =>
        onDragStart(index)
      }
      onDragEnter={() =>
        onDragEnter(index)
      }
      onDragOver={(e) =>
        e.preventDefault()
      }
      onDragEnd={onDragEnd}
      className={`group flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-150 sm:items-center sm:gap-4 sm:p-5 ${
        isDragging
          ? "opacity-40"
          : "opacity-100"
      } ${
        isDragOver
          ? "border-indigo-400 ring-2 ring-indigo-100"
          : "border-gray-100"
      }`}
    >
      <span
        className="mt-1 cursor-grab touch-none text-gray-300 group-hover:text-gray-400 active:cursor-grabbing sm:mt-0"
        aria-hidden
      >
        <GripIcon />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="break-words text-base font-semibold text-gray-900">
            {field.label}
          </h3>

          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            File upload
          </span>

          {field.requiresBothSides && (
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
              Front &amp; back
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
          {field.description}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {formatConstraints(field)}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() =>
              onMove(index, -1)
            }
            disabled={index === 0}
            aria-label={`Move ${field.label} up`}
            className={iconBtn}
          >
            <ChevronIcon up />
          </button>

          <button
            type="button"
            onClick={() =>
              onMove(index, 1)
            }
            disabled={
              index === total - 1
            }
            aria-label={`Move ${field.label} down`}
            className={iconBtn}
          >
            <ChevronIcon />
          </button>

          <button
            type="button"
            onClick={() =>
              onRemove(field.id)
            }
            aria-label={`Remove ${field.label}`}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Required
          </span>

          <Toggle
            checked={field.required}
            onChange={() =>
              onToggle(field.id)
            }
            label={`${field.label} required`}
          />
        </div>
      </div>
    </li>
  )
);

FieldCard.displayName = "FieldCard";

// ─── Add-field form ───────────────────────────────────────

type NewField = Pick<
  IKycField,
  | "label"
  | "description"
  | "requiresBothSides"
  | "documentType"
>;

interface IAddFieldProps {
  open: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onAdd: (data: NewField) => void;
}

const AddFieldPanel = memo(
  ({
    open,
    onOpen,
    onCancel,
    onAdd,
  }: IAddFieldProps) => {
    const [label, setLabel] =
      useState("");

    const [description, setDescription] =
      useState("");

    const [bothSides, setBothSides] =
      useState(false);

    const labelRef =
      useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (open) {
        labelRef.current?.focus();
      }
    }, [open]);

    const reset = () => {
      setLabel("");
      setDescription("");
      setBothSides(false);
    };

    const submit = (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (!label.trim()) return;

      /*
       * Existing UI doesn't have a separate
       * document-type selector.
       *
       * CUSTOM is the correct backend value
       * for a document entered manually by the
       * tenant.
       */
      onAdd({
        label: label.trim(),
        description:
          description.trim(),
        requiresBothSides: bothSides,
        documentType:
          KycDocumentType.CUSTOM,
      });

      reset();
    };

    const inputCls =
      "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

    if (!open) {
      return (
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 px-4 py-10 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <PlusIcon size={20} />
          </span>

          <span className="text-base font-bold text-gray-900">
            Add another verification field
          </span>

          <span className="text-xs text-gray-500 sm:text-sm">
            Drag and drop components to reorganize
          </span>
        </button>
      );
    }

    return (
      <form
        onSubmit={submit}
        className="space-y-3 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <h3 className="text-base font-semibold text-gray-900">
          New document
        </h3>

        <div>
          <label
            htmlFor="kyc-label"
            className="mb-1 block text-xs font-semibold text-gray-600"
          >
            Document name
          </label>

          <input
            id="kyc-label"
            ref={labelRef}
            className={inputCls}
            value={label}
            onChange={(e) =>
              setLabel(e.target.value)
            }
            placeholder="e.g. Passport"
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="kyc-desc"
            className="mb-1 block text-xs font-semibold text-gray-600"
          >
            Help text
          </label>

          <input
            id="kyc-desc"
            className={inputCls}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="What should the user upload?"
            maxLength={300}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={bothSides}
            onChange={(e) =>
              setBothSides(
                e.target.checked
              )
            }
            className="h-4 w-4 rounded border-gray-300 text-indigo-700 focus:ring-indigo-400"
          />

          Requires front and back sides
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              reset();
              onCancel();
            }}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!label.trim()}
            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add field
          </button>
        </div>
      </form>
    );
  }
);

AddFieldPanel.displayName =
  "AddFieldPanel";

// ─── Live preview ─────────────────────────────────────────

const PreviewField = memo(
  ({ field }: { field: IKycField }) => (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-700">
        {field.label}

        {field.required && (
          <span className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm italic text-gray-400">
        {field.requiresBothSides
          ? "Select front and back…"
          : "Select file…"}

        <PaperclipIcon />
      </div>

      <p className="mt-1.5 text-[11px] text-gray-500">
        {formatConstraints(field)}
      </p>
    </div>
  )
);

PreviewField.displayName =
  "PreviewField";

const KycPreview = memo(
  ({
    fields,
  }: {
    fields: IKycField[];
  }) => (
    <section
      aria-label="User KYC preview"
      className="flex flex-col rounded-3xl bg-gray-100/80 p-5 sm:p-6 lg:min-h-[calc(100vh-8rem)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          User KYC Preview
        </h2>

        <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
          Live view
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5">
        {fields.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            Add a field to see how users
            will verify their identity.
          </p>
        ) : (
          <>
            {fields.map((f) => (
              <PreviewField
                key={f.id}
                field={f}
              />
            ))}

            <button
              type="button"
              disabled
              className="mt-2 w-full rounded-xl bg-indigo-800 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 disabled:cursor-default"
            >
              Submit for Verification
            </button>
          </>
        )}
      </div>

      <p className="mt-8 flex items-center justify-center gap-1.5 border-t border-gray-200 pt-4 text-[11px] text-gray-500">
        <ShieldIcon />
        Secured by FundNest Vault
      </p>
    </section>
  )
);

KycPreview.displayName =
  "KycPreview";

// ─── Autosave indicator ───────────────────────────────────

const SaveIndicator = ({
  status,
  error,
}: {
  status: SaveStatus;
  error: string | null;
}) => {
  const map: Record<
    SaveStatus,
    {
      text: string;
      cls: string;
    }
  > = {
    idle: {
      text: "No changes",
      cls: "text-gray-400",
    },
    saving: {
      text: "Saving…",
      cls: "text-gray-500",
    },
    saved: {
      text: "Autosaved",
      cls: "text-emerald-800",
    },
    error: {
      text:
        error ??
        "Save failed. Try again.",
      cls: "text-red-600",
    },
  };

  const { text, cls } = map[status];

  return (
    <span
      role="status"
      aria-live="polite"
      className={`flex items-center gap-1.5 text-xs font-medium ${cls}`}
    >
      {status === "saved" && (
        <CheckCircleIcon />
      )}

      {text}
    </span>
  );
};

// ─── Editor ───────────────────────────────────────────────

const KycEditor: React.FC<{
  template: IKycTemplateView;
}> = ({ template }) => {
  const [fields, setFields] =
    useState<IKycField[]>(
      template.fields
    );

  const [isActive, setIsActive] =
    useState<boolean>(
      template.isActive
    );

  const [adding, setAdding] =
    useState(false);

  const [status, setStatus] =
    useState<SaveStatus>("idle");

  const [error, setError] =
    useState<string | null>(null);

  const [dragIndex, setDragIndex] =
    useState<number | null>(null);

  const [overIndex, setOverIndex] =
    useState<number | null>(null);

  const [
    mobileTab,
    setMobileTab,
  ] = useState<
    "config" | "preview"
  >("config");

  const dirty = useRef(false);

  const fieldsRef =
    useRef(fields);

  const activeRef =
    useRef(isActive);

  fieldsRef.current = fields;
  activeRef.current = isActive;

  const persist = useCallback(
    async () => {
      const current =
        fieldsRef.current;

      if (current.length === 0) {
        setError(EMPTY_MESSAGE);
        setStatus("error");
        return;
      }

      setStatus("saving");
      setError(null);

      try {
        await tenantKycConfigService.saveTemplate(
          {
            name: template.name,
            description:
              template.description,
            isActive:
              activeRef.current,
          },
          current
        );

        /*
         * If the user kept editing while
         * the request was running, a new
         * autosave is queued.
         */
        if (
          fieldsRef.current === current
        ) {
          dirty.current = false;
        }

        setStatus("saved");
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Save failed. Try again."
        );

        setStatus("error");
      }
    },
    [
      template.name,
      template.description,
    ]
  );

  // Debounced autosave
  useEffect(() => {
    if (!dirty.current) return;

    if (fields.length === 0) {
      setError(EMPTY_MESSAGE);
      setStatus("error");
      return;
    }

    setStatus("saving");

    const t = window.setTimeout(
      persist,
      AUTOSAVE_DELAY_MS
    );

    return () =>
      window.clearTimeout(t);
  }, [
    fields,
    isActive,
    persist,
  ]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    const onBeforeUnload = (
      e: BeforeUnloadEvent
    ) => {
      if (dirty.current) {
        e.preventDefault();
      }
    };

    window.addEventListener(
      "beforeunload",
      onBeforeUnload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        onBeforeUnload
      );
  }, []);

  const update = useCallback(
    (
      updater: (
        prev: IKycField[]
      ) => IKycField[]
    ) => {
      dirty.current = true;
      setFields(updater);
    },
    []
  );

  const handleToggle =
    useCallback(
      (id: string) =>
        update((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  required:
                    !f.required,
                }
              : f
          )
        ),
      [update]
    );

  const handleRemove =
    useCallback(
      (id: string) =>
        update((prev) =>
          prev.filter(
            (f) => f.id !== id
          )
        ),
      [update]
    );

  const handleMove =
    useCallback(
      (
        index: number,
        dir: -1 | 1
      ) =>
        update((prev) => {
          const target =
            index + dir;

          if (
            target < 0 ||
            target >= prev.length
          ) {
            return prev;
          }

          const next = [...prev];

          [
            next[index],
            next[target],
          ] = [
            next[target],
            next[index],
          ];

          return next;
        }),
      [update]
    );

  const handleAdd =
    useCallback(
      (data: NewField) => {
        update((prev) => [
          ...prev,
          {
            ...data,

            id: crypto.randomUUID(),

            /*
             * KYC requirements are always
             * file uploads in the backend.
             */
            type: "FILE_UPLOAD",

            /*
             * Preserve your existing UI
             * behavior: newly added fields
             * start as optional.
             */
            required: false,

            /*
             * Backend defaults.
             */
            allowedMimeTypes: [
              ...DEFAULT_MIME_TYPES,
            ],

            maxFileSizeMb:
              DEFAULT_MAX_FILE_MB,
          },
        ]);

        setAdding(false);
      },
      [update]
    );

  const handleActiveToggle =
    useCallback(() => {
      dirty.current = true;

      setIsActive((v) => !v);
    }, []);

  const handleDragEnd =
    useCallback(() => {
      if (
        dragIndex !== null &&
        overIndex !== null &&
        dragIndex !== overIndex
      ) {
        update((prev) => {
          const next = [...prev];

          const [moved] =
            next.splice(
              dragIndex,
              1
            );

          next.splice(
            overIndex,
            0,
            moved
          );

          return next;
        });
      }

      setDragIndex(null);
      setOverIndex(null);
    }, [
      dragIndex,
      overIndex,
      update,
    ]);

  const requiredCount =
    useMemo(
      () =>
        fields.filter(
          (f) => f.required
        ).length,
      [fields]
    );

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {/* Title + actions */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            KYC Configuration
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define the documents and details
            required for user verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setMobileTab("config");
              setAdding(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 transition hover:bg-gray-50"
          >
            <PlusIcon size={14} />
            Add Field
          </button>

          <button
            type="button"
            onClick={persist}
            disabled={
              status === "saving"
            }
            className="rounded-xl bg-indigo-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:bg-indigo-900 disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Mobile / tablet tab switch */}

      <div
        role="tablist"
        className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-gray-200/70 p-1 lg:hidden"
      >
        {(
          ["config", "preview"] as const
        ).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={
              mobileTab === tab
            }
            onClick={() =>
              setMobileTab(tab)
            }
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              mobileTab === tab
                ? "bg-white text-indigo-800 shadow-sm"
                : "text-gray-500"
            }`}
          >
            {tab === "config"
              ? "Configure"
              : "Preview"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:gap-8">
        {/* Configuration canvas */}

        <section
          aria-label="Configuration canvas"
          className={
            mobileTab === "config"
              ? "block"
              : "hidden lg:block"
          }
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Configuration canvas

              <span className="ml-2 normal-case tracking-normal text-gray-400">
                {requiredCount} of{" "}
                {fields.length} required
              </span>
            </h2>

            <SaveIndicator
              status={status}
              error={error}
            />
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                Require KYC for investors
              </p>

              <p className="text-xs text-gray-500">
                {isActive
                  ? "Users must complete these documents before joining a fund."
                  : "KYC is off. Users can join funds without verification."}
              </p>
            </div>

            <Toggle
              checked={isActive}
              onChange={
                handleActiveToggle
              }
              label="Require KYC for investors"
            />
          </div>

          <ul className="flex flex-col gap-3">
            {fields.map((f, i) => (
              <FieldCard
                key={f.id}
                field={f}
                index={i}
                total={fields.length}
                isDragging={
                  dragIndex === i
                }
                isDragOver={
                  overIndex === i &&
                  dragIndex !== i
                }
                onToggle={
                  handleToggle
                }
                onRemove={
                  handleRemove
                }
                onMove={handleMove}
                onDragStart={
                  setDragIndex
                }
                onDragEnter={
                  setOverIndex
                }
                onDragEnd={
                  handleDragEnd
                }
              />
            ))}
          </ul>

          <div className="mt-4">
            <AddFieldPanel
              open={adding}
              onOpen={() =>
                setAdding(true)
              }
              onCancel={() =>
                setAdding(false)
              }
              onAdd={handleAdd}
            />
          </div>
        </section>

        {/* Live preview */}

        <div
          className={`lg:sticky lg:top-20 lg:self-start ${
            mobileTab === "preview"
              ? "block"
              : "hidden lg:block"
          }`}
        >
          <KycPreview
            fields={fields}
          />
        </div>
      </div>
    </main>
  );
};

// ─── Loading / error states ───────────────────────────────

const PageSkeleton = () => (
  <main
    className="flex-1 animate-pulse px-4 py-6 sm:px-6 lg:px-8"
    aria-busy="true"
  >
    <div className="mb-8 h-8 w-64 rounded bg-gray-200" />

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-gray-200"
          />
        ))}
      </div>

      <div className="hidden h-96 rounded-3xl bg-gray-200 lg:block" />
    </div>
  </main>
);

const LoadError: React.FC<{
  message: string;
  onRetry: () => void;
}> = ({
  message,
  onRetry,
}) => (
  <main className="flex flex-1 items-center justify-center px-4 py-16">
    <div className="max-w-sm rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
      <h1 className="text-base font-semibold text-gray-900">
        Couldn&apos;t load KYC configuration
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-indigo-800 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-900"
      >
        Try again
      </button>
    </div>
  </main>
);

// ─── Page (container) ─────────────────────────────────────

const KycConfigurationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.tenant.tenant);

  const [template, setTemplate] = useState<IKycTemplateView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!tenant) {
      tenantAuthService
        .getTenantProfile()
        .then((data) => {
          dispatch(setTenant(data));
        })
        .catch((err) => {
          console.error("Failed to fetch tenant profile:", err);
        });
    }
  }, [dispatch, tenant]);

  useEffect(() => {
    const controller = new AbortController();

    setLoadError(null);

    tenantKycConfigService
      .getTemplate(controller.signal)
      .then(setTemplate)
      .catch((e: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setLoadError(
          e instanceof Error ? e.message : "Please try again."
        );
      });

    return () => controller.abort();
  }, [reloadKey]);

  if (!tenant) return <Navigate to={ROUTES.TENANT.LOGIN} replace />;

  const tenantUser: TenantUser = {
    name: tenant.ownerName || tenant.companyName,
    role: "Tenant Administrator",
    verificationStatus: mapTenantVerificationStatus(tenant.status),
    rejectionReason: tenant.rejectionReason,
    profile: tenant,
  };

  const isVerified = tenantUser.verificationStatus === "active";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeHref={ROUTES.TENANT.KYC_CONFIG}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        disabled={!isVerified}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={tenantUser}
          onMenuClick={() => setSidebarOpen(true)}
          disableSearch={!isVerified}
        />

        {loadError ? (
          <LoadError
            message={loadError}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        ) : template ? (
          <KycEditor template={template} />
        ) : (
          <PageSkeleton />
        )}
      </div>
    </div>
  );
};

export default KycConfigurationPage;
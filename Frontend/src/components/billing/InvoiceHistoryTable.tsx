import { useState } from "react";
import { Download, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import type { InvoiceRecord } from "../../types/billing.types";

interface InvoiceHistoryTableProps {
  invoices: InvoiceRecord[];
}

export default function InvoiceHistoryTable({ invoices }: InvoiceHistoryTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const handlePrintInvoice = (invoice: InvoiceRecord) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Billing History & Invoices</h3>
        <span className="text-xs text-slate-500">{invoices.length} invoices found</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No invoices generated yet</p>
            <p className="text-xs text-slate-400">Invoices will appear here after your first payment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Invoice No</th>
                  <th className="px-6 py-3.5 font-semibold">Date</th>
                  <th className="px-6 py-3.5 font-semibold">Plan</th>
                  <th className="px-6 py-3.5 font-semibold">Amount</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Payment ID</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{inv.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{inv.planName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{inv.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      {inv.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Paid
                        </span>
                      ) : inv.status === "FAILED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <XCircle className="h-3.5 w-3.5 text-red-500" /> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <Clock className="h-3.5 w-3.5 text-amber-500" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {inv.razorpayPaymentId || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handlePrintInvoice(inv)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-500" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Tax Invoice Modal */}
      {selectedInvoice && (
        <div className="hidden print:block fixed inset-0 bg-white p-10 text-slate-900">
          <div className="flex justify-between border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">FundNest</h1>
              <p className="text-xs text-slate-500">Subscription Tax Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{selectedInvoice.invoiceNumber}</p>
              <p className="text-xs text-slate-500">Date: {selectedInvoice.date}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <p><strong>Plan Name:</strong> {selectedInvoice.planName}</p>
            <p><strong>Amount Paid:</strong> ₹{selectedInvoice.amount.toLocaleString("en-IN")}</p>
            <p><strong>Payment ID:</strong> {selectedInvoice.razorpayPaymentId}</p>
            <p><strong>Order ID:</strong> {selectedInvoice.razorpayOrderId}</p>
            <p><strong>Status:</strong> {selectedInvoice.status}</p>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            Thank you for using FundNest.
          </div>
        </div>
      )}
    </div>
  );
}
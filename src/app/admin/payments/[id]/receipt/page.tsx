'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Printer, Send, CheckCircle2 } from 'lucide-react'

function PaymentReceiptPrint() {
  const params = useSearchParams()
  const amount = Number(params.get('amount') || 0)
  const mode = params.get('mode') || 'Cash'
  const ref = params.get('ref') || ''
  const order_num = params.get('order_num') || ''
  const client_name = params.get('client_name') || ''
  const order_amount = Number(params.get('order_amount') || 0)
  const paid_total = Number(params.get('paid_total') || amount)
  const balance = order_amount - paid_total
  const today = new Date().toLocaleDateString('en-IN')
  const receiptNum = `AR-RCP-${Date.now().toString(36).toUpperCase().slice(-6)}`

  const whatsappText = `*AR FURNITURE - PAYMENT RECEIPT*\n\n` +
    `Receipt No: ${receiptNum}\n` +
    `Client: ${client_name}\n` +
    (order_num ? `Order Ref: ${order_num}\n` : '') +
    `Amount Received: ₹${amount.toLocaleString('en-IN')} (${mode})\n` +
    (ref ? `Payment Ref: ${ref}\n` : '') +
    `Balance Remaining: ${balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : 'FULLY PAID ✅'}\n` +
    `Date: ${today}\n\n` +
    `Thank you for connecting with AR FURNITURE!`;

  return (
    <div className="min-h-screen bg-zinc-100 py-6 print:py-0 print:bg-white text-zinc-900 font-sans flex flex-col items-center">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
          .print-hidden { display: none !important; }
        }
      `}} />

      {/* Non-printable Action Bar */}
      <div className="w-full max-w-[800px] mb-4 px-4 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              window.location.href = '/admin/clients'
            }
          }}
          className="flex items-center gap-2 text-zinc-700 hover:text-black font-semibold transition-colors w-full sm:w-auto bg-white px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs"
        >
          <ArrowLeft size={18} /> Back to Clients / Khata
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-xs text-sm"
          >
            <Send size={18} /> Send WhatsApp
          </a>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-xs text-sm"
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Container */}
      <div className="w-full overflow-x-auto print:overflow-visible flex justify-start sm:justify-center px-4 sm:px-0 pb-10 print:pb-0">
        <div
          className="w-[800px] shrink-0 bg-white shadow-2xl print:shadow-none print:w-full overflow-hidden relative flex flex-col"
          style={{ minHeight: '800px' }}
        >
          {/* Header Banner */}
          <div className="p-8 bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden shrink-0 border-b-4 border-emerald-500">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-bold tracking-[0.25em] text-emerald-400 uppercase mb-2">
                  Official Payment Receipt
                </div>
                <h1 className="text-3xl font-black tracking-wider text-white font-serif">AR FURNITURE</h1>
                <p className="text-xs font-semibold text-zinc-300 tracking-[0.15em] mt-1">VADODARA, GUJARAT</p>
              </div>

              <div className="text-right">
                <span className="inline-block px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-black tracking-widest uppercase mb-2 shadow-md">
                  PAYMENT RECEIPT
                </span>
                <p className="text-sm font-bold text-white tracking-wider">NO : {receiptNum}</p>
                <p className="text-xs font-medium text-zinc-300 tracking-wide mt-0.5">DATE : {today}</p>
              </div>
            </div>
          </div>

          {/* Supplier & Client Info */}
          <div className="p-8 grid grid-cols-2 gap-6 shrink-0 bg-zinc-50/50 border-b border-zinc-200">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 border-b border-zinc-100 pb-1">RECEIVED BY (SUPPLIER)</h3>
              <p className="font-bold text-base text-zinc-900">AR FURNITURE</p>
              <p className="text-xs text-zinc-600 mt-1 font-medium leading-relaxed">
                1-2 Shashtri Nagar, Nr. Purnima Nagar,<br />
                New VIP Road, Vadodara, Gujarat
              </p>
              <p className="text-xs font-bold text-zinc-800 mt-2">Ph: +91 85119 39151</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs text-right">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 border-b border-zinc-100 pb-1">RECEIVED FROM (CLIENT)</h3>
              <p className="font-bold text-base text-zinc-900">{client_name}</p>
              {order_num && (
                <div className="mt-2 bg-emerald-50 border border-emerald-200 p-2 rounded-lg inline-block text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Against Order Ref.</p>
                  <p className="text-xs font-bold text-emerald-700">{order_num}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="p-8 pb-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Transaction Summary
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Total Order Value</span>
                  <span className="font-bold text-zinc-900">₹{order_amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 border-t border-b border-zinc-200 bg-emerald-50/50 px-4 rounded-xl border border-emerald-100">
                  <span className="font-bold text-zinc-800">Amount Received Now</span>
                  <span className="text-2xl font-black text-emerald-600">₹{amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-600">Payment Mode</span>
                  <span className="font-bold text-zinc-900 bg-white px-3 py-1 rounded-md border border-zinc-200">{mode}</span>
                </div>

                {ref && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Payment Ref / Transaction No.</span>
                    <span className="font-bold text-zinc-900">{ref}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-zinc-200 text-xs">
                  <span className="text-zinc-600">Total Paid Till Date</span>
                  <span className="font-bold text-zinc-900">₹{paid_total.toLocaleString('en-IN')}</span>
                </div>

                <div className={`flex justify-between items-center px-4 py-3 rounded-xl ${balance > 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {balance > 0 ? 'Balance Due' : '✓ FULLY PAID'}
                  </span>
                  <span className="font-black text-lg">
                    {balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : 'CLEARED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="px-8 pb-4 mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold text-zinc-900">Thank you for connecting with AR FURNITURE!</p>
                <p className="text-xs text-zinc-500 mt-1">If you have any questions regarding this receipt, contact us at +91 85119 39151.</p>
              </div>

              <div className="text-center flex flex-col items-center justify-end">
                <img src="/signature.png" alt="Gulfam Signature" className="h-14 object-contain mb-[-6px] mix-blend-multiply" />
                <div className="border-t-2 border-zinc-900 pt-1 w-44">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Authorized Signatory</p>
                  <p className="text-[10px] font-semibold text-zinc-500">AR FURNITURE</p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 mt-4 pt-3">
              <p className="text-[9px] text-zinc-400 leading-snug">
                1. Amount received will be adjusted against order value. 2. Balance payment as per agreed terms. 3. Receipt confirms payment only.
              </p>
            </div>
          </div>

          {/* Bottom Luxury Dual Accent Bar */}
          <div className="h-3 bg-zinc-900 shrink-0 w-full relative">
            <div className="h-1.5 bg-emerald-500 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-sans text-zinc-600">Loading receipt...</div>}>
      <PaymentReceiptPrint />
    </Suspense>
  )
}

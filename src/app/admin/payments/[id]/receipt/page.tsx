'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

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

  return (
    <div className="min-h-screen bg-gray-100 py-6 print:py-0 print:bg-white text-black font-sans flex flex-col items-center">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
          .print-hidden { display: none !important; }
        }
      `}} />

      {/* Non-printable action bar */}
      <div className="w-full max-w-[800px] mb-4 px-4 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              window.location.href = '/admin/clients'
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold transition-colors w-full sm:w-auto bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          ← Back to Clients / Khata
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `*AR FURNITURE - PAYMENT RECEIPT*\n\n` +
              `Receipt No: ${receiptNum}\n` +
              `Client: ${client_name}\n` +
              `Order: ${order_num}\n` +
              `Amount Received: ₹${amount.toLocaleString('en-IN')} (${mode})\n` +
              (ref ? `Ref No: ${ref}\n` : '') +
              `Balance Due: ${balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : 'FULLY PAID ✅'}\n` +
              `Date: ${today}\n\n` +
              `Thank you for your payment!`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-sm"
          >
            📲 WhatsApp
          </a>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-sm"
          >
            🖨️ Download / Print PDF
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="w-full overflow-x-auto print:overflow-visible flex justify-start sm:justify-center px-4 sm:px-0 pb-10 print:pb-0">
        <div
          className="w-[800px] shrink-0 bg-white shadow-2xl print:shadow-none print:w-full overflow-hidden relative flex flex-col"
          style={{ minHeight: '800px' }}
        >
          {/* Header */}
          <div className="relative h-32 bg-[#1e293b] flex items-center justify-between px-10 shrink-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[55%] h-full bg-[#c8941a] skew-x-[-30deg] origin-bottom translate-x-12" />
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-white tracking-widest">AR FURNITURE</h1>
              <p className="text-[10px] text-[#c8941a] tracking-[0.25em] uppercase mt-1">PREMIUM FURNITURE VADODARA</p>
            </div>
            <div className="relative z-10 text-right">
              <h2 className="text-4xl font-bold text-[#1e293b] tracking-widest uppercase">RECEIPT</h2>
              <p className="text-xs font-semibold tracking-wider text-[#1e293b] uppercase mt-1">NO : {receiptNum}</p>
              <p className="text-xs font-semibold tracking-wider text-[#1e293b] uppercase">DATE : {today}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="flex justify-between px-10 py-8 shrink-0">
            <div className="w-[45%]">
              <h3 className="bg-[#1e293b] text-white inline-block px-3 py-1 text-xs font-bold mb-3 tracking-wider uppercase">Received By :</h3>
              <p className="font-bold text-lg text-gray-900 mb-1">AR FURNITURE</p>
              <p className="text-sm text-gray-600">1-2 Shashtri Nagar, Nr. Purnima Nagar</p>
              <p className="text-sm text-gray-600">New VIP Road, Vadodara, Gujarat</p>
              <p className="text-sm font-bold text-gray-800 mt-1">Ph: +91 85119 39151</p>
            </div>
            <div className="w-[45%] text-right">
              <h3 className="bg-[#1e293b] text-white inline-block px-3 py-1 text-xs font-bold mb-3 tracking-wider uppercase">Received From :</h3>
              <p className="font-bold text-lg text-gray-900 mb-1">{client_name}</p>
              {order_num && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Against Order</p>
                  <p className="text-sm font-bold text-[#c8941a]">{order_num}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details Box */}
          <div className="px-10 pb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Value</span>
                  <span className="font-bold text-gray-900">₹{order_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-b border-gray-200">
                  <span className="text-sm font-bold text-gray-700">Amount Received Now</span>
                  <span className="text-xl font-black text-green-600">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Mode</span>
                  <span className="font-bold text-gray-900">{mode}</span>
                </div>
                {ref && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Ref. No.</span>
                    <span className="font-bold text-gray-900">{ref}</span>
                  </div>
                )}
                {!ref && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Ref. No.</span>
                    <span className="text-gray-400 border-b border-gray-300 w-48 inline-block text-right">&nbsp;</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Total Paid Till Now</span>
                  <span className="font-bold text-gray-900">₹{paid_total.toLocaleString('en-IN')}</span>
                </div>
                <div className={`flex justify-between items-center px-4 py-3 rounded-lg ${balance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <span className={`font-bold text-sm ${balance > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {balance > 0 ? 'Balance Due' : '✓ Fully Paid'}
                  </span>
                  <span className={`font-black text-lg ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : 'PAID'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 pb-4 mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold text-gray-700">Thank you for connecting with AR FURNITURE!</p>
                <p className="text-xs text-gray-400 mt-1">If you have any questions regarding this document, please contact us at +91 85119 39151.</p>
              </div>
              <div className="text-center flex flex-col items-center justify-end">
                <img src="/signature.png" alt="Signature" className="h-12 object-contain mb-[-6px] mix-blend-multiply" />
                <div className="border-t-2 border-[#1e293b] pt-1 min-w-[180px]">
                  <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Authorized Signatory</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-3">
              <p className="text-[9px] text-gray-400 leading-snug">
                1. Amount received will be adjusted against order value. 2. Balance payment as per agreed terms. 3. Receipt confirms payment only, not delivery/completion.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="h-10 bg-[#c8941a] relative overflow-hidden shrink-0 w-full">
            <div className="absolute top-0 bottom-0 left-0 w-[45%] bg-[#1e293b] skew-x-[30deg] origin-bottom -translate-x-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PaymentReceiptPrint />
    </Suspense>
  )
}

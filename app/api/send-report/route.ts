import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { reportEmail } from '@/lib/emails'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

export async function POST(req: NextRequest) {
  try {
    const { email, claudeMd, skills, mcps } = await req.json()

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!claudeMd || typeof claudeMd !== 'string') {
      return NextResponse.json({ error: 'Contenu manquant' }, { status: 400 })
    }

    const { subject, html } = reportEmail(claudeMd, skills ?? [], mcps ?? [])
    const resend = getResend()

    const { error } = await resend.emails.send({
      from: 'ClaudeFast <hello@noreply.mcpfast.xyz>',
      to: email,
      subject,
      html,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Send report error:', error)
    return NextResponse.json({ error: 'Erreur envoi' }, { status: 500 })
  }
}

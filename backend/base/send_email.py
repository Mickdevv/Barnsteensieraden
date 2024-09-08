import logging
from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from base.models import User
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.shortcuts import render

def email_verification_email(user):
    x=0
    print(user.emailVerified)
    # if True:
    if user.emailVerified == False:
        link = f"{settings.BASE_URL}profile/{user.confirmation_code.code}/"
        mailList = [user.email, 'michael@devereux.fm']
        print(link)    
        subject = 'Email verification'
        from_email = settings.EMAIL_HOST_USER
        
        print(f'{settings.BASE_URL}, {settings.EMAIL_HOST_USER}, {settings.EMAIL_HOST_PASSWORD}')
        
        # Dynamic data
        context = {'user':user, 'verification_url':link}
        try:
            # Render the HTML template with context
            html_content = render_to_string('emails/user_verification_code_email.html', context)
            text_content = strip_tags(html_content)  # Fallback plain text message

            # Create the email
            email = EmailMultiAlternatives(subject, text_content, from_email, mailList)
            email.attach_alternative(html_content, "text/html")
            
            # Send the email
            email.send()
            logging.info("Bid verification email sent successfully.")
        except Exception as e:
            # Log the error
            logging.error("An error occurred while sending bid verification email", exc_info=True)
            
            
def magic_link(user):
    print(settings.BASE_URL)
    
    link = f"{settings.BASE_URL}forgot-password/verify/{user.magic_link.code}/{user.id}"
    mailList = [user.email, 'michael@devereux.fm']
    print(link)    
    subject = 'Forgotten password'
    from_email = settings.EMAIL_HOST_USER
    
    print(f'{settings.BASE_URL}, {settings.EMAIL_HOST_USER}, {settings.EMAIL_HOST_PASSWORD}')
    
    # Dynamic data
    context = {'user':user, 'magic_link':link}
    try:
        # Render the HTML template with context
        html_content = render_to_string('emails/user_magic_link_email.html', context)
        text_content = strip_tags(html_content)  # Fallback plain text message

        # Create the email
        email = EmailMultiAlternatives(subject, text_content, from_email, mailList)
        email.attach_alternative(html_content, "text/html")
        
        # Send the email
        email.send()
        logging.info("Magic link email sent successfully.")
    except Exception as e:
        # Log the error
        logging.error("An error occurred while sending magic link email", exc_info=True)
        
    
def admin_registration_notification(user):
    link = f"{settings.BASE_URL}admin/user/{user.id}/edit"
    mailList = ["michael@devereux.fm", settings.EMAIL_HOST_USER]
        
    subject = f'Notification: {user.first_name} {user.last_name} has just signed up'
    from_email = settings.EMAIL_HOST_USER
    
    # Dynamic data
    context = {'user':user, 'user_details_link':link}
    try:
        # Render the HTML template with context
        html_content = render_to_string('emails/user_signup_notification_email.html', context)
        text_content = strip_tags(html_content)  # Fallback plain text message

        # Create the email
        email = EmailMultiAlternatives(subject, text_content, from_email, mailList)
        email.attach_alternative(html_content, "text/html")
        
        # Send the email
        email.send()
        logging.info("User signup notification email sent successfully.")
    except Exception as e:
        # Log the error
        logging.error("An error occurred while sending the user signup notification email", exc_info=True)
        
    
def order_notification(bid):
    if bid.approved == True:
        mailList = [user.email for user in User.objects.all()]
        mailList.append(settings.EMAIL_HOST_USER)
        mailList.append("michael@devereux.fm")
        print(mailList)
            
        subject = 'A new bid has been placed'
        from_email = settings.EMAIL_HOST_USER
        bidding_url = f'{settings.BASE_URL}bidding/'
        
        # Dynamic data
        context = {'bid':bid, 'bidding_url':bidding_url}
        try:
            # Render the HTML template with context
            html_content = render_to_string('emails/new_bid_notification_email.html', context)
            text_content = strip_tags(html_content)  # Fallback plain text message

            for email_address in mailList:
                # Create the email
                email = EmailMultiAlternatives(subject, text_content, from_email, [email_address])
                email.attach_alternative(html_content, "text/html")
                
                # Send the email
                email.send()
                logging.info("Bid notification email sent successfully.")
        except Exception as e:
            # Log the error
            logging.error("An error occurred while sending bid notification email", exc_info=True)

from django.shortcuts import render, redirect
import os

# Create your views here.
def index(request):
    # Path to the built React index.html file
    react_build_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '../', 'frontend', 'build', 'index.html')
    return render(request, react_build_path)